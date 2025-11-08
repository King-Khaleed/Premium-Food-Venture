import { MapPin, Phone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { OrderForm } from '@/components/order-form';

export function Contact() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Get In Touch</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Place an order or send us an inquiry. We're happy to help!
                    </p>
                </div>
                <div className="space-y-6 text-lg">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">123 Fresh Market St, Seafood City, 12345</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="font-medium">(123) 456-7890</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Store Hours:</p>
                            <ul className="text-muted-foreground">
                              <li>Mon - Fri: 9:00 AM - 7:00 PM</li>
                              <li>Sat: 10:00 AM - 6:00 PM</li>
                              <li>Sun: Closed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="p-6 sm:p-8 shadow-lg">
                <OrderForm />
            </Card>
        </div>
    </section>
  );
}
