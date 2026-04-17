import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Music2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSEO } from '../utils/seo';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Set SEO meta tags for contact page
  useSEO({
    title: 'Contact FEModels Dubai - Model Agency UAE Inquiries | Get Started',
    description: 'Contact FEModels modeling agency in Dubai. Casting inquiries, model applications, career questions. Phone, email, WhatsApp. 24-hour response time.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-40 left-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold">
              Contact FEModels - Dubai's Leading Model Agency UAE
            </h1>
            <h2 className="text-xl md:text-2xl text-yellow-500 mb-8 font-semibold">
              Let's Discuss Your Next Campaign or Modeling Career
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Whether you're a brand seeking the perfect talent for your campaign, an aspiring model ready to launch your career, or a creative professional exploring collaboration opportunities, FEModels welcomes your inquiries. As Dubai's most established modeling agency with fifteen years of industry expertise, we're committed to responsive, personalized service that addresses your unique needs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-yellow-500">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 4 XXX XXXX"
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Casting inquiry / Model application / Other"
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry or campaign brief..."
                    rows={5}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  ></textarea>
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3">
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Office Visit */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-yellow-500">Visit Our Dubai Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">FEModels Agency</p>
                      <p className="text-white/70">[Full Address]</p>
                      <p className="text-white/70">Dubai, United Arab Emirates</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Office Hours</p>
                      <p className="text-white/70">Monday - Friday: 9:00 AM - 6:00 PM GST</p>
                      <p className="text-white/70">Saturday: 10:00 AM - 4:00 PM GST</p>
                      <p className="text-white/70 mt-2 text-sm italic">Sunday: Closed</p>
                      <p className="text-white/50 text-sm mt-2">By Appointment: In-person meetings available by appointment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-yellow-500">Quick Contact</h3>
                <div className="space-y-4">
                  <a href="mailto:info@femodels.com" className="flex items-center gap-4 hover:text-yellow-500 transition">
                    <Mail className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-white/60">Email</p>
                      <p className="font-semibold">info@femodels.com</p>
                    </div>
                  </a>
                  <a href="tel:+971545381138" className="flex items-center gap-4 hover:text-yellow-500 transition">
                    <Phone className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-white/60">Phone</p>
                      <p className="font-semibold">+971 54 538 1138</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-yellow-500">Follow FEModels</h3>
                <p className="text-white/70 mb-6">Stay updated on latest castings, model spotlights, and industry insights:</p>
                <div className="flex gap-4 flex-wrap">
                  <a href="https://www.instagram.com/femodels/" className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500 rounded-lg p-3 transition flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">@femodels</span>
                  </a>
                  <a href="https://www.facebook.com/FEModelsAgency" className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500 rounded-lg p-3 transition flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">/FEModelsAgency</span>
                  </a>
                  <a href="https://www.tiktok.com/@femodels_dubai" className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500 rounded-lg p-3 transition flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">@femodels_dubai</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-20 pt-20 border-t border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: "What's the best way to contact FEModels for casting inquiries?",
                  a: "Email info@femodels.com or call +971 54 538 1138. Include your casting brief details for fastest turnaround. We respond within 24 hours, with same-day priority for urgent requests."
                },
                {
                  q: "Can I visit FEModels Dubai office without an appointment?",
                  a: "We recommend scheduling appointments for in-person meetings to ensure our team is available to provide focused attention to your needs."
                },
                {
                  q: "How quickly does your modeling agency in Dubai respond to inquiries?",
                  a: "Most inquiries receive responses within 24 hours. Call us at +971 54 538 1138 or email info@femodels.com for urgent requests, which we prioritize for same-day turnaround whenever possible."
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h4 className="text-yellow-500 font-semibold mb-3">{faq.q}</h4>
                  <p className="text-white/70">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
