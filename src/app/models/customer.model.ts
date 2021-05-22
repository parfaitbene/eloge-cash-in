export class Customer {
    id: string;
    firstName: string;
    name: string;
    email: string;
    phone: string;
    accountNumber: string;

    constructor(firstName: string, name: string, accountNumber: string) {
        this.firstName = firstName;
        this.name = name;
        this.accountNumber = accountNumber;
    }
}