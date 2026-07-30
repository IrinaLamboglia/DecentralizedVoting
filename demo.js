// DEMO: Votación anónima con Semaphore Protocol (ZK-SNARKs)

const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");
const { generateProof, verifyProof } = require("@semaphore-protocol/proof");

async function main() {
  console.log("DEMO: Votación anónima con Semaphore \n");

  // Cada votante genera su identidad ZK (off-chain, en su wallet)

  console.log("[1] Generando identidades de votantes...");
  const alice = new Identity();
  const bob = new Identity();
  const carla = new Identity();

  console.log("    Alice  commitment:", alice.commitment.toString());
  console.log("    Bob    commitment:", bob.commitment.toString());
  console.log("    Carla  commitment:", carla.commitment.toString());
  console.log("    (la clave privada de cada uno NUNCA se comparte)\n");

  // se crea el grupo de votantes habilitados (árbol de Merkle)
  // esto sería gestionado por el contrato Semaphore.sol on-chain.

  console.log("[2] Creando grupo de votantes habilitados (Merkle Tree)...");
  const electionGroup = new Group([
    alice.commitment,
    bob.commitment,
    carla.commitment
  ]);
  console.log("    Root del árbol:", electionGroup.root.toString());
  console.log("    Cantidad de miembros:", electionGroup.size, "\n");

  //  Bob vota de forma anónima.
  // "scope" = identificador de la elección (evita doble voto en ESTA elección,
  //           pero permite que el mismo votante participe en otra elección distinta)
  // "message" = el voto en sí (ej: índice del candidato)
  console.log("[3] Bob genera una prueba ZK de que es un votante válido...");
  const electionScope = "eleccion-2026";
  const vote = 1; // ej: vota al candidato con índice 1

  try {
    const proof = await generateProof(bob, electionGroup, vote, electionScope);

    console.log("    Prueba generada ");
    console.log("    Nullifier  :", proof.nullifier.toString());
    console.log("    Merkle root:", proof.merkleTreeRoot.toString());
    console.log("    Mensaje (voto):", proof.message.toString());
    console.log("    No aparece el commitment de Bob en ningún lado.");
    console.log("       Solo se sabe que ALGUIEN del grupo votó.\n");

    // cualquiera (el contrato, un auditor) verifica la prueba
    // sin aprender la identidad de quién votó.
    console.log("[4] Verificando la prueba (sin conocer la identidad)...");
    const isValid = await verifyProof(proof);
    console.log("    ¿Prueba válida?", isValid ? "SÍ" : "NO");

    console.log("\n[5] Intento de DOBLE VOTO (mismo votante, mismo scope)...");
    const secondProof = await generateProof(bob, electionGroup, vote, electionScope);
    const sameNullifier = secondProof.nullifier === proof.nullifier;
    console.log("    Nullifier repetido:", sameNullifier ? "SÍ -> el contrato lo rechazaría" : "NO");

  } catch (err) {
    // generateProof necesita descargar los artefactos del circuito (.zkey/.wasm)
    // generados en la Trusted Setup Ceremony de Semaphore (snark-artifacts.pse.dev).
    // Si la red local bloquea ese dominio, mostramos qué pasaría conceptualmente.
    console.log("    No se pudo descargar el circuito ZK (.zkey/.wasm):", err.message);
    console.log("    Esto requiere acceso a snark-artifacts.pse.dev (~14MB).");
    console.log("    En una red sin restricciones esto generaría:");
    console.log("      - nullifier: hash único ligado a (identidad secreta + scope)");
    console.log("      - merkleTreeRoot: el root", electionGroup.root.toString());
    console.log("      - una prueba Groth16 verificable on-chain en ~60k gas");
  }

  console.log("\n=== Conclusión ===");
  console.log("El contrato on-chain solo necesita guardar:");
  console.log("  - El root del árbol de votantes habilitados");
  console.log("  - Los nullifiers ya usados para este 'scope'");
  console.log("Nunca necesita saber qué wallet corresponde a cada voto.");
}

main().catch(console.error);
