export class SnowflakeGenerator {
	private sequence: bigint = 0n;
	private lastTimestamp: bigint = -1n;
	private readonly machineId: bigint;
	private readonly sequenceBits: bigint = 12n;
	private readonly machineIdBits: bigint = 10n;
	private readonly maxMachineId: bigint;

	constructor(
		machineId: number,
		private readonly epoch: bigint = 0n
	) {
		this.maxMachineId = (1n << this.machineIdBits) - 1n;

		if (machineId > Number(this.maxMachineId) || machineId < 0) {
			throw new Error(`Machine ID should be between 0 and ${this.maxMachineId}`);
		}

		this.machineId = BigInt(machineId);
	}

	private waitForNextMillis(lastTimestamp: bigint): bigint {
		let timestamp = BigInt(Date.now());
		while (timestamp <= lastTimestamp) {
			timestamp = BigInt(Date.now());
		}
		return timestamp;
	}

	public generateId(): bigint {
		let timestamp = BigInt(Date.now());
		const currentTimestamp = timestamp - this.epoch;

		if (currentTimestamp < this.lastTimestamp) {
			throw new Error("Clock moved backwards!");
		}

		if (currentTimestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1n) & ((1n << this.sequenceBits) - 1n);
			if (this.sequence === 0n) {
				timestamp = this.waitForNextMillis(this.lastTimestamp);
			}
		} else {
			this.sequence = 0n;
		}

		this.lastTimestamp = currentTimestamp;

		return (
			(currentTimestamp << (this.machineIdBits + this.sequenceBits)) |
			(this.machineId << this.sequenceBits) |
			this.sequence
		);
	}
}

//TODO: dynamic Machine id from process
const machineId = 1;
const snowflakeGenerator = new SnowflakeGenerator(machineId);

export const GenerateSnowflakeId = (mid: number, offset?: bigint) => {
	return snowflakeGenerator.generateId();
};
