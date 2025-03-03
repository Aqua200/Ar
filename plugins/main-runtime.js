let handler = async (m, { conn }) => {
    let _muptime = 0;
    if (process.send) {
        process.send('uptime');
        _muptime = await new Promise(resolve => {
            process.once('message', msg => {
                if (!isNaN(msg)) resolve(Number(msg));
                else resolve(0);
            });
            setTimeout(() => resolve(0), 1000);
        });
    } else {
        _muptime = process.uptime() * 1000; // Alternativa para entornos sin process.send
    }
    
    let muptime = clockString(_muptime);
    conn.reply(m.chat, `*🍭 He estado activa durante :* ${muptime}`, m);
};

handler.help = ['runtime'];
handler.tags = ['main'];
handler.command = ['runtime', 'uptime'];
export default handler;

function clockString(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [d, 'd ', h, 'h ', m, 'm ', s, 's '].map(v => v.toString().padStart(2, '0')).join('');
}
