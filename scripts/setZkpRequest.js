async function main() {

  const circuitId = "credentialAtomicQuerySig";
  const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  // Grab the schema hash from Polygon ID Platform
  const schemaHash = "fe8c562bfa69eff7ddae9d1005a2c31e"

  const schemaEnd = fromLittleEndian(hexToBytes(schemaHash))

  // Prover must be born before 20010101
  const ageQuery = {
  schema: ethers.BigNumber.from(schemaEnd),
  slotIndex: 3,
  operator: 2,
  value: [20010101, ...new Array(63).fill(0).map(i => 0)],
  circuitId,
  };

  const countryQuery = {
    schema: ethers.BigNumber.from(schemaEnd),
    slotIndex: 2,
    operator: 4,
    value: [91, 65, ...new Array(63).fill(0).map(i => 0)],
    circuitId,
  }

  // address of the SBT Contract
  SBTVerifierAddress = "0xeA524Fa4af9185329c22c7B9E248956AD4C90121"

  let sbtVerifier = await hre.ethers.getContractAt("ZkpNftToken", SBTVerifierAddress)

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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
