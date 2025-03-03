import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command }) => {
    let member = participants.map(u => u.id)
    let emoji = '🫥' // Emoji predeterminado
    let emoji2 = '📜' // Otro emoji para listas
    let msm = '🔴' // Otro emoji para mensajes, si quieres cambiarlo

    let sum = text ? text : member.length
    let total = 0
    let sider = []

    for (let i = 0; i < sum; i++) {
        let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
        let userData = global.db.data.users[member[i]]

        if ((typeof userData == 'undefined' || userData.chat == 0) && !users?.isAdmin && !users?.isSuperAdmin) {
            if (userData && userData.whitelist === false) {
                total++
                sider.push(member[i])
            } else if (!userData) {
                total++
                sider.push(member[i])
            }
        }
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    switch (command) {
        case 'fantasmas': 
            if (total === 0) return conn.reply(m.chat, `${emoji} Este grupo es activo, no tiene fantasmas.`, m) 
            m.reply(`${emoji} *Revisión de inactivos*\n\n${emoji2} *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n*📝 NOTA:*\nEsto no es al 100% acertado, el bot inicia el conteo de mensajes a partir de que se active en este número.`, null, { mentions: sider }) 
            break

        case 'kickfantasmas':  
            if (total === 0) return conn.reply(m.chat, `${emoji} Este grupo es activo, no tiene fantasmas.`, m) 

            await m.reply(`${emoji} *Eliminación de inactivos*\n\n${emoji2} *Lista de fantasmas*\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n${msm} _*El bot eliminará a los usuarios de la lista mencionada cada 10 segundos.*_`, null, { mentions: sider }) 
            
            await delay(10 * 1000)

            let chat = global.db.data.chats[m.chat]
            chat.welcome = false

            try {
                let users = (m.mentionedJid || []).filter(u => !areJidsSameUser(u, conn.user.id))
                let kickedGhost = sider.filter(v => v !== conn.user.id)

                for (let user of users) {
                    if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
                        let res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                        kickedGhost.push(...res)
                        await delay(10 * 1000)
                    }
                }
            } finally {
                chat.welcome = true
            }
            break            
    }
}

handler.tags = ['grupo']
handler.command = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler
