// Servicio GATEWAY — la ÚNICA puerta del sistema (:8080).
// Sirve la mini web y enruta a los servicios internos. Clave del lab:
// les habla por su NOMBRE DE SERVICIO (http://catalogo:4001), y la red interna
// de Docker lo resuelve sola. El gateway es el único que publica un puerto afuera.
import express from 'express'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 8080

// Las URLs vienen por variable de entorno (las define el compose.yml).
// Si corrieras fuera de Docker, el valor por defecto apunta a localhost.
const CATALOGO = process.env.CATALOGO_URL || 'http://localhost:4001'
const BIBLIOTECA = process.env.BIBLIOTECA_URL || 'http://localhost:4002'

// Sirve la mini web (public/index.html).
app.use(express.static('public'))

// Catálogo: el gateway le pide la lista al servicio CATÁLOGO.
app.get('/api/catalogo', async (req, res) => {
  const r = await fetch(`${CATALOGO}/juegos`)
  res.json(await r.json())
})

// Mi biblioteca: el gateway le pide la lista al servicio BIBLIOTECA.
app.get('/api/biblioteca', async (req, res) => {
  const r = await fetch(`${BIBLIOTECA}/mios`)
  res.json(await r.json())
})

// COMPRAR: acá se ven DOS microservicios colaborando.
// 1) el gateway le pide el juego al CATÁLOGO
// 2) y lo manda al servicio BIBLIOTECA para guardarlo.
app.post('/api/comprar/:id', async (req, res) => {
  const rc = await fetch(`${CATALOGO}/juegos/${req.params.id}`)
  if (!rc.ok) return res.status(404).json({ error: 'Juego no encontrado' })
  const juego = await rc.json()

  const rb = await fetch(`${BIBLIOTECA}/mios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(juego),
  })
  res.status(201).json(await rb.json())
})

app.listen(PORT, () => console.log(`[gateway] PlayStation Store en http://localhost:${PORT}`))
