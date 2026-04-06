import dbConnect from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";

export async function GET() {
    try {
        const testBuffer = Buffer.from("Test file for Cloudflare R2 Upload");
        const filename = `test-${Date.now()}.txt`;
        const testUrl = await uploadToR2(testBuffer, filename, 'text/plain');
        
        return Response.json({ 
            success: true, 
            message: "Cloudflare R2 is WORKING!",
            testUrl: testUrl
        });
    } catch (error) {
        console.error("R2 TEST FAILED:", error);
        return Response.json({ 
            success: false, 
            error: error.message,
            config: {
                endpoint: process.env.R2_ENDPOINT,
                bucket: process.env.R2_BUCKET_NAME,
                hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
                hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
                publicUrl: process.env.R2_PUBLIC_URL
            }
        }, { status: 500 });
    }
}
