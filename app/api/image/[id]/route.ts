// app/api/image/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/prisma/db";

export async function GET(request: NextRequest) {
  //   }
  try {
    const id: string =
      request.url.split("/")[request.url.split("/").length - 1];
    if (!id) {
      const imageBuffer = fs.readFileSync("./user.png");
      const mimeType = `image/${path.extname("./user.png").slice(1)}`;

      // Create a response with the appropriate headers
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": mimeType,
          "Content-Length": imageBuffer.length.toString(),
        },
      });
    }
    let image = await prisma.images.findUnique({where:{id}});
    if(!image){
      const imageBuffer = fs.readFileSync("./user.png");
    const mimeType = `image/${path.extname("./user.png").slice(1)}`;

    // Create a response with the appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
      },
    });
    }
    if(fs.existsSync(image.fileName)){
      const imageBuffer = fs.readFileSync(image.fileName);
      const mimeType = `image/${path.extname(image.fileName).slice(1)}`;
  
      // Create a response with the appropriate headers
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": mimeType,
          "Content-Length": imageBuffer.length.toString(),
        },
      }); 
    }
    const imageBuffer = fs.readFileSync("./user.png");
    const mimeType = `image/${path.extname("./user.png").slice(1)}`;

    // Create a response with the appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    const imageBuffer = fs.readFileSync("./user.png");
    const mimeType = `image/${path.extname("./user.png").slice(1)}`;

    // Create a response with the appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  }
  // Read the image file
}
