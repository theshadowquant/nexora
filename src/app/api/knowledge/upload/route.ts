import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Validate content length header
    const contentLengthHeader = req.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (contentLength > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Payload Too Large: Upload limit is 10MB." },
          { status: 413 }
        );
      }
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Bad Request: No file provided in form payload." },
        { status: 400 }
      );
    }

    // Double check size on blob
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload Too Large: Upload limit is 10MB." },
        { status: 413 }
      );
    }

    // 3. Verify MIME type is PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Unsupported Media Type: Only PDF documents are allowed." },
        { status: 415 }
      );
    }

    return NextResponse.json(
      {
        message: "PDF upload validation checks completed successfully.",
        filename: file.name,
        sizeBytes: file.size,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Document upload check failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error during upload check." },
      { status: 500 }
    );
  }
}
