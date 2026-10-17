import { NextResponse } from 'next/server';
import { getDbClient } from '../../../../../lib/db';
import { getMockStore } from '../../../../../lib/db/seed';
import { licenses, hubItems, deviceSyncQueue } from '../../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { licenseKey, hubItemId, hardwareFingerprint, action = 'INSTALL', priority = 'NORMAL' } = body;

    if (!licenseKey || !hubItemId) {
      return NextResponse.json(
        { success: false, error: 'licenseKey and hubItemId are required.' },
        { status: 400 }
      );
    }

    const client = getDbClient();
    const isMock = (client as any).isMock;
    const store = getMockStore();

    let licenseRecord: any = null;

    if (isMock) {
      licenseRecord = store.licenses.find(l => l.licenseKey.trim() === licenseKey.trim());
    } else {
      try {
        const records = await (client as any)
          .select()
          .from(licenses)
          .where(eq(licenses.licenseKey, licenseKey.trim()))
          .limit(1);
        licenseRecord = records[0] || null;
      } catch (e) {
        licenseRecord = store.licenses.find(l => l.licenseKey.trim() === licenseKey.trim());
      }
    }

    if (!licenseRecord) {
      return NextResponse.json(
        { success: false, error: 'License key not recognized.' },
        { status: 404 }
      );
    }

    if (licenseRecord.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `License is ${licenseRecord.status}.` },
        { status: 403 }
      );
    }

    const dispatchId = `disp_${crypto.randomBytes(8).toString('hex')}`;
    const newDispatch = {
      id: dispatchId,
      licenseKey: licenseKey.trim(),
      hardwareFingerprint: hardwareFingerprint?.trim() || null,
      hubItemId: hubItemId.trim(),
      status: 'QUEUED',
      action: action.toUpperCase(),
      priority: priority.toUpperCase(),
      createdAt: new Date(),
      deliveredAt: null,
    };

    if (isMock || !(client as any).insert) {
      if (!store.deviceSyncQueue) store.deviceSyncQueue = [];
      store.deviceSyncQueue.push(newDispatch as any);
    } else {
      try {
        await (client as any).insert(deviceSyncQueue).values(newDispatch);
      } catch {
        if (!store.deviceSyncQueue) store.deviceSyncQueue = [];
        store.deviceSyncQueue.push(newDispatch as any);
      }
    }

    return NextResponse.json({
      success: true,
      dispatchId,
      status: 'QUEUED',
      item: {
        hubItemId,
        licenseKey,
        action,
        priority,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to queue dispatch' },
      { status: 500 }
    );
  }
}
