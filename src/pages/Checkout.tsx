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
        return <div className="py-10 text-center text-white/70">Twój koszyk jest pusty.</div>
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <form className="card glass p-5 space-y-4 floating" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">Zamówienie</p>
                    <h2 className="text-xl font-semibold text-white">Dane do wysyłki</h2>
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Imię i nazwisko*</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Email*</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60" {...register('email')} />
                    {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Adres*</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60" {...register('address')} />
                    {errors.address && <p className="text-sm text-red-300 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Notatki</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 min-h-24 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60" {...register('notes')} />
                    {errors.notes && <p className="text-sm text-red-300 mt-1">{errors.notes.message}</p>}
                </div>
                <button disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}
                </button>
            </form>

            <aside className="card glass p-5 h-fit floating">
                <h3 className="font-semibold mb-3 text-white">Podsumowanie</h3>
                <ul className="space-y-2 mb-4">
                    {
                        items.map(item => (
                            <li key={item.id} className="flex justify-between text-sm text-white/80">
                                <span className="line-clamp-1">{item.title} - {item.qty} szt.</span>
                                <span>{formatPrice(item.price * item.qty)}</span>
                            </li>
                        ))
                    }
                </ul>
                <div className="flex justify-between font-semibold text-lg text-white">
                    <span>Razem</span>
                    <span>{formatPrice(totalPrice())}</span>
                </div>
            </aside>
        </div>

    )
}
