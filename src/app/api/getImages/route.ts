import { createClient } from '@/utils/supabase/server';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req:NextRequest) {
    const supabase =await  createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('userId', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ images: data }, { status: 200 });
}
