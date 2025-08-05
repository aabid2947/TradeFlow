"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, PlayCircle } from "lucide-react"

const Card = ({ title, description }) => (
    <motion.div className="bg-white p-6 rounded-lg shadow-md border border-gray-200" variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-[#00A389]" />
            <span className="text-sm font-semibold text-gray-600">veriffiable</span>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button className="bg-[#00A389] hover:bg-[#008C77] text-white px-6 py-2 rounded-md transition-colors">
            Learn more <span className="ml-1">&gt;</span>
        </Button>
    </motion.div>
);

export default function TrustFeatures({ data }) {
    const {
        trustTitle = 'How returning customer trust can unlock the power of the digital economy',
        trustImage,
        trustCard1,
        trustCard2,
        trustCard3,
    } = data || {};

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <motion.h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-center mb-12 text-gray-900" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                    {trustTitle}
                </motion.h2>
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col gap-8">
                        <motion.div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                            <img src={trustImage?.url || 'https://placehold.co/800x450'} alt="Customer trust" className="rounded-lg w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="h-16 w-16 text-white/80 hover:text-white transition-colors cursor-pointer" />
                            </div>
                        </motion.div>
                        {trustCard1?.title && <Card title={trustCard1.title} description={trustCard1.description} />}
                    </div>
                    <div className="flex flex-col gap-8">
                        {trustCard2?.title && <Card title={trustCard2.title} description={trustCard2.description} />}
                        {trustCard3?.title && <Card title={trustCard3.title} description={trustCard3.description} />}
                    </div>
                </div>
            </div>
        </section>
    );
}