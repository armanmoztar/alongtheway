import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';  

dotenv.config();  
const app = express();  
const supabaseUrl = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;  
const supabase = createClient(supabaseUrl, key);

app.get('/stops', async (req, res) => {
    let route_short_name = req.query.route_short_name;
    if (!route_short_name) {
        return res.status(400).json({ error: 'route_short_name is required' });
    }
    if (route_short_name.length === 2 && Number.isInteger(route_short_name) && parsenInt(route_short_name) < 100) {
            route_short_name = '0' + route_short_name;
    }
    const { data, error } = await supabase
        .from('trips_routes')
        .select('stop_name, stop_lat, stop_lon, stop_sequence')
        .eq('route_short_name', route_short_name)
        .eq('direction_id', 0)
        .order('stop_sequence', { ascending: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (data.length === 0) {
        return res.status(404).json({ error: 'route_short_name not found' });
    }
    // const stops = await supabase.rpc('get_stops', { route_id: id });
    res.json({ "stops": data});
});

app.listen(5001, () => {
    console.log('Server is running on port 5001')
});