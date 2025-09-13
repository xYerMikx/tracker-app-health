import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const uid = session?.user?.id;

  if (!uid) {
    throw new Error("Not authorized");
  }

  try {
    const waterIntakes = await prisma.waterIntake.findMany({
      where: { userId: uid },
      orderBy: { takenAt: "desc" },
    });
    return NextResponse.json(waterIntakes);
  } catch (error) {
    console.error("Error fetching water intake records:", error);
    return NextResponse.json(
      { error: "Failed to fetch water intake records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const uid = session?.user?.id;

  if (!uid) {
    throw new Error("Not authorized");
  }

  try {
    const { volumeMl, takenAt, note } = await request.json();

    if (typeof volumeMl !== "number" || !takenAt) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const newRecord = await prisma.waterIntake.create({
      data: {
        volumeMl,
        takenAt: new Date(takenAt),
        note,
        userId: uid,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating water intake record:", error);
    return NextResponse.json(
      { error: "Failed to create water intake record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  const uid = session?.user?.id;

  if (!uid) {
    throw new Error("Not authorized");
  }

  try {
    const { id, volumeMl, takenAt, note } = await request.json();

    if (typeof id !== "number" || typeof volumeMl !== "number" || !takenAt) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const updatedRecord = await prisma.waterIntake.update({
      where: { id, userId: uid },
      data: {
        volumeMl,
        takenAt: new Date(takenAt),
        note,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating water intake record:", error);
    return NextResponse.json(
      { error: "Failed to update water intake record" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  const session = await auth();
  const uid = session?.user?.id;

  if (!uid) {
    throw new Error("Not authorized");
  }

  try {
    const { id } = await request.json();

    if (typeof id !== "number") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    await prisma.waterIntake.delete({
      where: { id, userId: uid },
    });

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting water intake record:", error);
    return NextResponse.json(
      { error: "Failed to delete water intake record" },
      { status: 500 }
    );
  }
}
