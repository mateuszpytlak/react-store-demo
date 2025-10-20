export const formatPrice = (value: number) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'PLN'
    }).format(value);
}
