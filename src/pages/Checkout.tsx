import {useCart} from "../store/cart/cart.ts";
import {formatPrice} from "../utils/format.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";

const schema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.email('Invalid email'),
    address: z.string().min(5, 'Address is too short'),
    notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>;

export const Checkout = () => {
    const {items, totalPrice, clear} = useCart();
    const navigate = useNavigate();

    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const total = totalPrice();
        clear();
        navigate('/products', {replace: true});
        alert(`Order placed!\nName: ${data.name}\nTotal: ${formatPrice(total)}`)
    }

    if (items.length === 0) {
        return <div className="py-10 text-center">Your cart is empty.</div>
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <form className="card p-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-lg font-semibold mb-2">Checkout</h2>
                <div>
                    <label className="block text-sm mb-1">Full name*</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1">Email*</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" {...register('email')} />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1">Address*</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" {...register('address')} />
                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1">Notes</label>
                    <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-24" {...register('notes')} />
                    {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>}
                </div>
                <button disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? 'Placing order...' : 'Place order'}
                </button>
            </form>

            <aside className="card p-4 h-fit">
                <h3 className="font-semibold mb-3">Order summary</h3>
                <ul className="space-y-2 mb-4">
                    {
                        items.map(item => (
                            <li key={item.id} className="flex justify-between text-sm">
                                <span className="line-clamp-1">{item.title} × {item.qty}</span>
                                <span>{formatPrice(item.price * item.qty)}</span>
                            </li>
                        ))
                    }
                </ul>
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice())}</span>
                </div>
            </aside>
        </div>

    )
}
