import { IBuyer, TPayment } from '../../types';

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel implements IBuyer {
    payment: TPayment = 'card';
    email: string = '';
    phone: string = '';
    address: string = '';

    // Установить конкретное поле (можно использовать для частичного обновления)
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this[field] = value;
    }

    // Получить все данные покупателя
    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    // Очистить все поля
    clear(): void {
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    // Валидация: возвращает объект с ошибками для непустых полей
    validate(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }

    // Проверка валидности всех полей (удобно для активации кнопки)
    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }
}
