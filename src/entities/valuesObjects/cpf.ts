export class CPF {
	private _cpf: string;

	constructor(cpf: string) {
		if (!this.validate(cpf)) {
			throw new Error("CPF inválido!");
		}
		this._cpf = cpf;
	}

	validate(cpf: string): boolean {
		cpf = cpf.replace(/[^\d]+/g, "");

		if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
			return false;
		}

		let sum = 0;
		for (let i = 0; i < 9; i++) {
			sum += parseInt(cpf.charAt(i)) * (10 - i);
		}

		let remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === parseInt(cpf.charAt(9))) {
			sum = 0;
			for (let i = 0; i < 10; i++) {
				sum += parseInt(cpf.charAt(i)) * (11 - i);
			}

			remainder = (sum * 10) % 11;
			return remainder === 10 || remainder === parseInt(cpf.charAt(10));
		}

		return false;
	}

	get cpf(): string {
		return this._cpf.replace(/[^\d]+/g, "");
	}
}
