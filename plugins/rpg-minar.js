let handler = async (m, { conn }) => {
  let users = Object.entries(global.db.data.users)
    .filter(([_, user]) => user.limit > 0) // Solo los que tengan dulces
    .sort((a, b) => b[1].limit - a[1].limit) // Ordenar de mayor a menor
    .map(([id, user], index) => `*${index + 1}.-* @${id.split('@')[0]} ➤ *${user.limit} 🍬*`)
    .slice(0, 10) // Top 10

  if (!users.length) return m.reply('⚠️ Nadie ha minado todavía.')

  let mensaje = `🏆 *Clasificación de Minería* 🏆\n\n${users.join('\n')}\n\n¡Sigue minando para estar en el top!`
  m.reply(mensaje, null, { mentions: users.map(u => u.split(' ')[1].replace('@', '') + '@s.whatsapp.net') })
}

handler.help = ['baltop']
handler.tags = ['rpg']
handler.command = ['baltop', 'minetop'] 

export default handler
