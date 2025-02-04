import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: Request, { params }: { params: any }) {
    try {
        const { id: imageId  } = await  params;
        console.log(imageId);
        const supabase = await createClient();

        // Authenticate the user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = user.id;

        if (!imageId) {
            return NextResponse.json({ error: "Missing image ID" }, { status: 400 });
        }

        // Fetch image details to get the URL
        const { data: image, error: fetchError } = await supabase
            .from("images")
            .select("url")
            .eq("id", imageId)
            .eq("userId", userId)
            .single();

        if (fetchError || !image) {
            return NextResponse.json({ error: "Image not found or unauthorized" }, { status: 404 });
        }
        console.log('data:',image);
        const {data, error: storageError } = await supabase.storage
            .from("photopod1")
            .remove([image.url]);
        console.log('removeBucket:',data);
        console.log('storageError:',storageError);
        if (storageError) {
            return NextResponse.json({ error: "Failed to delete image from storage" }, { status: 500 });
        }

        // Delete the image record from the database
        const { error: deleteError } = await supabase
            .from("images")
            .delete()
            .eq("id", imageId);

        if (deleteError) {
            return NextResponse.json({ error: "Failed to delete image record" }, { status: 500 });
        }

        return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
