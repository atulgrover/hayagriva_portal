import { NextResponse } from 'next/server';
import { getDbClient } from '../../../../../../lib/db';
import { getMockStore } from '../../../../../../lib/db/seed';
import { licenses, activations, hubItems } from '../../../../../../lib/db/schema';
import { calculateFileDiff } from '../../../../../../lib/services/deltaSync';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const licenseKey = (
      request.headers.get('x-hayagriva-license') ||
      request.headers.get('x-license-key') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      ''
    ).trim();

    if (!licenseKey) {
      return NextResponse.json(
        { success: false, error: 'Chamber license header (X-Hayagriva-License) required' },
        { status: 401 }
      );
    }

    const fingerprint = (
      request.headers.get('x-hayagriva-fingerprint') ||
      request.headers.get('x-device-fingerprint') ||
      ''
    ).trim();

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Hardware fingerprint header (X-Hayagriva-Fingerprint) required' },
        { status: 403 }
      );
    }

    const client = getDbClient();
    const isMock = (client as any).isMock;
    const store = getMockStore();

    let license: any = null;
    let activation: any = null;

    if (isMock) {
      license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey);
      if (license) {
        activation = store.activations.find(
          (a) => a.licenseId === license.id && a.hardwareFingerprint.trim() === fingerprint && a.isActive
        );
      }
    } else {
      try {
        const licenseRecords = await (client as any)
          .select()
          .from(licenses)
          .where(eq(licenses.licenseKey, licenseKey))
          .limit(1);
        license = licenseRecords[0] || null;

        if (license) {
          const actRecords = await (client as any)
            .select()
            .from(activations)
            .where(
              and(
                eq(activations.licenseId, license.id),
                eq(activations.hardwareFingerprint, fingerprint),
                eq(activations.isActive, true)
              )
            )
            .limit(1);
          activation = actRecords[0] || null;
        }

        if (!activation && license) {
          activation = store.activations.find(
            (a) => a.licenseId === license.id && a.hardwareFingerprint.trim() === fingerprint && a.isActive
          );
        }
      } catch {
        license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey);
        if (license) {
          activation = store.activations.find(
            (a) => a.licenseId === license.id && a.hardwareFingerprint.trim() === fingerprint && a.isActive
          );
        }
      }
    }

    if (!license || license.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Active license required' }, { status: 401 });
    }

    if (!activation) {
      return NextResponse.json(
        { success: false, error: 'Hardware fingerprint not authorized for this license' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { itemId, urn, clientHashes = {} } = body;

    if (!itemId && !urn) {
      return NextResponse.json({ success: false, error: 'itemId or urn required' }, { status: 400 });
    }

    let targetItem: any = null;
    if (isMock) {
      targetItem = (store.hubItems || []).find((i) => i.id === itemId || i.urn === urn || i.slug === itemId);
    } else {
      try {
        const allItems = await (client as any).select().from(hubItems);
        targetItem = allItems.find((i: any) => i.id === itemId || i.urn === urn || i.slug === itemId);
      } catch {
        targetItem = (store.hubItems || []).find((i) => i.id === itemId || i.urn === urn || i.slug === itemId);
      }
    }

    if (!targetItem) {
      return NextResponse.json({ success: false, error: 'Hub item not found' }, { status: 404 });
    }

    const serverFiles = targetItem.manifest?.files || [];
    const diff = calculateFileDiff(serverFiles, clientHashes);

    return NextResponse.json({
      success: true,
      itemId: targetItem.id,
      urn: targetItem.urn,
      name: targetItem.name,
      hasUpdates: diff.hasUpdates,
      updatedFiles: diff.updatedFiles,
      deletedFiles: diff.deletedFiles,
      unchangedFilesCount: diff.unchangedFilesCount,
      totalServerFiles: serverFiles.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Delta diff failed' },
      { status: 500 }
    );
  }
}
