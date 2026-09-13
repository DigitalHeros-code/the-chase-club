import { NextResponse } from 'next/server';

let serverRegistrations = [];

export async function GET() {
  return NextResponse.json({ success: true, registrations: serverRegistrations });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newReg = {
      ...body,
      id: 'reg-' + Date.now(),
      registeredAt: new Date().toISOString()
    };
    serverRegistrations = [newReg, ...serverRegistrations];
    return NextResponse.json({ success: true, registration: newReg, registrations: serverRegistrations });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
