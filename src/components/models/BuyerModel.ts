import { IBuyer, TPayment } from '../../types';

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel implements IBuyer {
    protected _payment: TPayment = '';
    protected _email: string = '';
    protected _phone: string = '';
    protected _address: string = '';

    // Геттеры для доступа к полям (если нужны)
    get payment(): TPayment {
        return this._payment;
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }

    get address(): string {
        return this._address;
    }

    // Установка конкретного поля
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment;
                break;
            case 'email':
                this._email = value as string;
                break;
            case 'phone':
                this._phone = value as string;
                break;
            case 'address':
                this._address = value as string;
                break;
        }
    }

    // Получение всех данных
    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
        };
    }

    // Очистка всех полей
    clear(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }

    // Валидация: возвращает объект с ошибками для непустых полей
    validate(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        if (!this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }
}