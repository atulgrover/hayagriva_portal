import { NextResponse } from 'next/server';
import { getDbClient } from '../../../../../../lib/db';
import { getMockStore } from '../../../../../../lib/db/seed';
import { licenses, hubItems } from '../../../../../../lib/db/schema';
import { generateAirgapPack } from '../../../../../../lib/security/airgapPacker';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { licenseKey, hardwareFingerprint, itemIds = [] } = body;

    if (!licenseKey || !hardwareFingerprint) {
      return NextResponse.json(
        { success: false, error: 'licenseKey and hardwareFingerprint required.' },
        { status: 400 }
      );
    }

    const client = getDbClient();
    const isMock = (client as any).isMock;
    const store = getMockStore();

    let license: any = null;
    if (isMock) {
      license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey.trim());
    } else {
      try {
        const records = await (client as any)
          .select()
          .from(licenses)
          .where(eq(licenses.licenseKey, licenseKey.trim()))
          .limit(1);
        license = records[0] || null;
      } catch {
        license = store.licenses.find((l) => l.licenseKey.trim() === licenseKey.trim());
      }
    }

    if (!license || license.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Valid active license required.' },
        { status: 403 }
      );
    }

    // Load items
    let allItems: any[] = [];
    if (isMock) {
      allItems = store.hubItems || [];
    } else {
      try {
        allItems = await (client as any).select().from(hubItems);
      } catch {
        allItems = store.hubItems || [];
      }
    }

    const selectedItems = itemIds.length > 0
      ? allItems.filter((i) => itemIds.includes(i.id) || itemIds.includes(i.urn) || itemIds.includes(i.slug))
      : allItems;

    const packBuffer = generateAirgapPack({
      licenseKey,
      hardwareFingerprint,
      items: selectedItems,
    });

    return new NextResponse(packBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-hayagriva-pack',
        'Content-Disposition': `attachment; filename="chamber-${licenseKey}-${Date.now()}.hpack"`,
        'Content-Length': packBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Airgap pack export failed' },
      { status: 500 }
    );
  }
}
