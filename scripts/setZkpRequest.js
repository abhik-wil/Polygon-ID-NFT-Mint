async function main() {

  const circuitId = "credentialAtomicQuerySig";
  const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  // Grab the schema hash from Polygon ID Platform
  const schemaHash = "770cf9ac189db86992744bc7025b2872"

  const schemaEnd = fromLittleEndian(hexToBytes(schemaHash))

  // Prover must be born before 20010101
  const ageQuery = {
  schema: ethers.BigNumber.from(schemaEnd),
  slotIndex: 3,
  operator: 2,
  value: [20010101, ...new Array(63).fill(0).map(i => 0)],
  circuitId,
  };

  // address of the SBT Contract
  SBTVerifierAddress = "<>"

  let sbtVerifier = await hre.ethers.getContractAt("ERC20Verifier", SBTVerifierAddress)

  const requestId = await sbtVerifier.TRANSFER_REQUEST_ID();

  try {
      await sbtVerifier.setZKPRequest(
      requestId,
      validatorAddress,
      ageQuery
      );
      console.log("Request set");
  } catch (e) {
      console.log("error: ", e);
  }
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function fromLittleEndian(bytes) {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
}
