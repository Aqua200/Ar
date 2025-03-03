let handler = async (m, { conn }) => {
  let _muptime;
  if (process.send) {
    // Envia la solicitud de uptime
    process.send('uptime');
    _muptime = await new Promise(resolve => {
      process.once('message', resolve);
      // Si no se recibe respuesta en 1 segundo, se resuelve en null
      setTimeout(() => resolve(null), 1000);
    });
  }
  // Si no se obtuvo un valor válido, usamos process.uptime() (en segundos) y lo convertimos a milisegundos
  if (!_muptime || isNaN(_muptime)) {
    _muptime = process.uptime() * 1000;
  } else {
    // Si se obtuvo el valor, asumimos que viene en segundos, lo convertimos a milisegundos
    _muptime *= 1000;
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
  return `${d}d ${h}h ${m}m ${s}s`;
}
