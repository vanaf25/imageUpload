import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const files: File[] = formData.getAll("images") as File[];
        if (files.length > 10) {
            return NextResponse.json({ error: "Max 10 images allowed per request" }, { status: 400 });
        }
        const { data: userImages, error: fetchError } = await supabase
            .from("images")
            .select("id")
            .eq("userId", user.id);
        if (fetchError) throw fetchError;
        if (userImages.length + files.length > 10) {
            return NextResponse.json({ error: "You can only have a max of 10 images" }, { status: 400 });
        }
        let uploadedImages: string[] = [];
        for (const file of files) {
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from("photopod1")
                .upload(filePath, file, { cacheControl: "3600", upsert: false });
            if (error) throw error;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const url = `${supabaseUrl}/storage/v1/object/public/photopod1/${data.path}`;
            uploadedImages.push(url);
        }
       const {data:images}= await supabase.from("images").insert(uploadedImages.map(url=>({url,userId:user.id}))).select()
        return NextResponse.json({ message: "Upload successful", images }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
