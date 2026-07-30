# DecentralizedVoting con Privacidad ZK

Sistema de votación transparente sobre Ethereum con integración de Zero-Knowledge Proofs (Semaphore).

**Trabajo final — Facultad de Informática, UNLP**  
**Irina Lamboglia — Legajo 18090/3**

---

## Descripción

Este proyecto implementa un sistema de votación descentralizado sobre la testnet Sepolia de Ethereum. Resuelve el problema de la falta de transparencia y privacidad en votaciones tradicionales usando blockchain y ZK-SNARKs.

**Contrato deployado en Sepolia:**  
`0xe5d603bef9800084c43a24c3ad66c56668d1577c`

---

## Estructura del proyecto

```
├── DecentralizedVoting.sol   # Smart contract en Solidity 0.8.18
├── voting-ui.html            # Interfaz web con MetaMask + identidad ZK
├── demo.js                   # Demo de Semaphore (ZK-SNARKs) en Node.js
└── package.json              # Dependencias del demo
```

---

## Contratos

### DecentralizedVoting.sol
Contrato ERC-compatible deployado en Sepolia. Permite:
- Crear una elección con candidatos
- Abrir y cerrar la votación (solo owner)
- Votar una vez por wallet
- Consultar candidatos y ganador

---

## Interfaz web

`voting-ui.html` — interfaz en HTML/JS puro con ethers.js v5 y MetaMask.

### Cómo correrla

Necesitás Node.js instalado. En la carpeta del proyecto:

```bash
npx serve .
```

Abrí `http://localhost:3000/voting-ui.html` en Brave o Chrome con MetaMask instalado en Sepolia.

### Funcionalidades
- Conectar MetaMask (red Sepolia)
- Genera automáticamente una identidad ZK al conectar
- Cargar el contrato por dirección
- Ver candidatos con barras de progreso en tiempo real
- Votar (con intento de prueba ZK antes de la transacción)
- Panel owner para iniciar/cerrar votación
- Ver ganador al cierre

---

## Demo de Semaphore (ZK-SNARKs)

`demo.js` demuestra el flujo completo de votación anónima con Zero-Knowledge Proofs:

1. Genera identidades ZK reales (clave privada EdDSA + commitment Poseidon)
2. Arma un grupo de votantes como árbol de Merkle
3. Genera una prueba ZK-SNARK real que demuestra pertenencia al grupo sin revelar la identidad
4. Verifica la prueba
5. Detecta intento de doble voto por nullifier repetido

### Cómo correrlo

```bash
npm install
node demo.js
```

La primera vez descarga los circuitos ZK (~14MB) de la Trusted Setup Ceremony oficial de Semaphore.

---

## Tecnologías

- **Solidity 0.8.18** — smart contract
- **Hardhat** — compilación y tests
- **ethers.js v5** — interacción con la blockchain desde el browser
- **MetaMask** — wallet y proveedor de red
- **Semaphore Protocol v4.14.2** — ZK-SNARKs para votación anónima
- **Sepolia Testnet** — red de prueba de Ethereum

---

## Verificar en Etherscan

[Ver contrato en Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe5d603bef9800084c43a24c3ad66c56668d1577c)
