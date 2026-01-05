import fs from 'fs';

export default {
  command: ['sticker', 's'],
  category: 'utils',
  run: async (client, m) => {
    try {
      let media
      const quoted = m.quoted ? m.quoted : m
      const mime = (quoted.msg || quoted).mimetype || ''
      
      let user = globalThis.db.data.users[m.sender];
      const name = user.name;
      let text1 = user.metadatos || `S'ᴛᴇʟʟᴀʀ 🧠 WᴀBᴏᴛ`;
      let text2 = user.metadatos2 || `@${name}`;
      
      if (/image/.test(mime) && !/webp/.test(mime)) {
        media = await quoted.download()  
        let encmedia = await client.sendImageAsSticker(m.chat, media, m, { packname: text1, author: text2})
        if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia)  

      } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 20) {
          return m.reply('🌽 El video no puede ser muy largo')
        }
        media = await quoted.download()
        let encmedia = await client.sendVideoAsSticker(m.chat, media, m, { packname: text1, author: text2})
        
        await new Promise((resolve) => setTimeout(resolve, 2000))
        if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia)  

      } else if (/webp/.test(mime)) {
        media = await quoted.download()
  
        let encmedia = await client.sendVideoAsSticker(m.chat, media, m, { packname: text1, author: text2})
        if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia)

      } else {
        return client.reply(m.chat, '🍒 Por favor, responde a una imagen, video o sticker para procesarlo.', m);
      }
    } catch (e) {
      console.error(e)
      m.reply('❌ Hubo un error al procesar el sticker: ' + e.message)
    }
  }
};
