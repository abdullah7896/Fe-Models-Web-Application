import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      category: "Services & Booking",
      faqs: [
        {
          q: "What services does FEModels modeling agency in Dubai provide?",
          a: "FEModels offers comprehensive model management including talent representation, casting services, face model selection, commercial bookings, fashion show coordination, and brand ambassador placements across Dubai and the UAE."
        },
        {
          q: "How can brands book models through your model agency UAE?",
          a: "Brands can submit casting briefs through our website, contact our booking team directly, or schedule a consultation. We provide curated talent selections within 24 hours, complete with portfolios, availability, and rates."
        },
        {
          q: "What types of models are available at modeling companies in Dubai like FEModels?",
          a: "We represent diverse talent including fashion models, commercial models, face models for product campaigns, runway specialists, fitness models, plus-size models, children, and promotional staff across all ethnicities and age ranges."
        },
        {
          q: "Is FEModels a licensed modeling agency in Dubai?",
          a: "Yes, FEModels operates with full UAE business licensing and maintains strict compliance with Dubai labor laws, model work permits, and industry ethical standards."
        },
        {
          q: "Can international models work with your model agency UAE?",
          a: "Absolutely. We facilitate work permits and visa processing for international models and maintain partnerships with agencies worldwide to source talent for specific campaigns requiring unique looks or specialized skills."
        },
        {
          q: "How many models does FEModels represent?",
          a: "Our current roster includes over 500 professional models across fashion, commercial, new faces, male, female, and children categories, representing diverse looks and specializations."
        },
        {
          q: "Can I view full portfolios before booking a Dubai model?",
          a: "Yes, registered clients access complete portfolios including professional photos, measurements, experience history, and previous campaign examples for informed casting decisions."
        },
        {
          q: "What's the booking process for face model and casting through FEModels?",
          a: "Browse portfolios, submit your brief with date requirements, receive curated selections within 24 hours, review options, and confirm your booking with our team managing all logistics."
        },
        {
          q: "Do you represent international models or only local Dubai talent?",
          a: "We represent both UAE-based models and facilitate international talent bookings through our global agency partnerships, providing diverse options for every campaign requirement."
        },
        {
          q: "What are typical rates for booking a model of Dubai through FEModels?",
          a: "Rates vary based on experience level, usage rights, and campaign scope. Contact our team for detailed rate cards specific to your project requirements."
        }
      ]
    },
    {
      category: "Casting & Production",
      faqs: [
        {
          q: "What casting services does your modeling agency in Dubai provide?",
          a: "We offer face model and casting services, fashion show production, commercial campaign management, digital content modeling, brand ambassador programs, and international talent sourcing."
        },
        {
          q: "How quickly can FEModels provide casting options for urgent campaigns?",
          a: "We guarantee 24-hour turnaround on casting briefs, providing curated talent selections with full portfolios, availability, and rate information within one business day."
        },
        {
          q: "What makes FEModels face model and casting process different?",
          a: "Our casting experts pre-vet every suggestion against your brief, ensuring you only review genuinely suitable options, saving time and delivering perfect matches for your brand vision."
        },
        {
          q: "Can international brands use FEModels model agency UAE services?",
          a: "Absolutely. We serve local, regional, and international clients, providing full support including work permit facilitation, logistics coordination, and on-ground production assistance throughout the UAE."
        },
        {
          q: "How quickly can FEModels provide model options after submitting a brief?",
          a: "We guarantee 24-hour turnaround, providing 5-10 curated model selections complete with portfolios, availability, and rates within one business day."
        },
        {
          q: "What information should I include in my casting brief?",
          a: "Include campaign description, specific look requirements, shoot dates/location, usage specifications (print/digital/TV), and budget parameters for accurate talent curation."
        },
        {
          q: "Can I meet models before confirming bookings?",
          a: "Yes, we arrange callback sessions or chemistry tests for clients who wish to meet talent in person before finalizing casting decisions."
        },
        {
          q: "Does FEModels charge hidden fees beyond quoted model rates?",
          a: "No. Our quotations include all costs transparently. Agency commission, model rates, and any production support fees are clearly itemized upfront with no surprises."
        },
        {
          q: "How far in advance should I book models through your modeling agency in Dubai?",
          a: "Ideally 2-4 weeks for best availability, though we accommodate rush bookings with as little as 48 hours notice based on talent availability."
        }
      ]
    },
    {
      category: "Model Application & Career",
      faqs: [
        {
          q: "Does FEModels model agency UAE charge application fees?",
          a: "No. We never charge application, registration, or joining fees. Legitimate agencies earn commission from bookings. If someone asks you to pay for representation, it's a scam."
        },
        {
          q: "Does FEModels provide services for models seeking representation?",
          a: "Yes, our model services include professional representation, portfolio development, academy training, casting access, career management, and ongoing mentorship."
        },
        {
          q: "What are requirements for becoming a model with your Dubai modeling agency?",
          a: "Requirements vary by category. Fashion models need specific height/measurements; commercial models emphasize versatility and relatable appearance. All categories require professionalism, reliability, and genuine passion."
        },
        {
          q: "How long does the application review process take?",
          a: "Initial review takes 7-10 business days. If selected for further consideration, we'll contact you to schedule an in-person meeting at our Dubai office."
        },
        {
          q: "Can I apply if I have no modeling experience?",
          a: "Yes. We represent both experienced models and promising newcomers. Our academy provides comprehensive training for those new to professional modeling."
        },
        {
          q: "Do I need professional photos to apply to FEModels modeling agency in Dubai?",
          a: "No. Submit natural, unedited snapshots showing your genuine appearance. We develop professional portfolios for represented models after signing."
        }
      ]
    },
    {
      category: "About FEModels",
      faqs: [
        {
          q: "When was FEModels modeling agency in Dubai established?",
          a: "FEModels was founded in 2009 by fashion industry veterans with the mission of establishing Dubai as a global modeling hub while maintaining ethical representation standards."
        },
        {
          q: "What makes FEModels different from other modeling companies in Dubai?",
          a: "Our differentiators include 15+ years industry experience, comprehensive career development programs, strict ethical standards, diverse talent representation, and personalized client service backed by deep regional market knowledge."
        },
        {
          q: "Does FEModels model agency UAE have international connections?",
          a: "Yes, we maintain partnerships with modeling agencies across Europe, Asia, and North America, enabling international talent exchanges and cross-border campaign facilitation."
        }
      ]
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold">
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Find answers to common questions about FEModels modeling agency services, booking process, and career opportunities.
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqData.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 rounded-lg text-sm">
                    {sectionIndex + 1}
                  </span>
                  {section.category}
                </h2>

                <div className="space-y-3">
                  {section.faqs.map((faq, faqIndex) => {
                    const globalIndex = section.faqs.slice(0, faqIndex).length + sectionIndex * 100 + faqIndex;
                    return (
                      <motion.div
                        key={faqIndex}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: faqIndex * 0.05 }}
                      >
                        <button
                          onClick={() => toggleAccordion(globalIndex)}
                          className="w-full flex items-start justify-between p-6 text-left hover:bg-white/5 transition"
                        >
                          <span className="flex-1 font-semibold text-white pr-4 text-lg">
                            {faq.q}
                          </span>
                          <motion.div
                            animate={{ rotate: openIndex === globalIndex ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-yellow-500" />
                          </motion.div>
                        </button>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: openIndex === globalIndex ? "auto" : 0,
                            opacity: openIndex === globalIndex ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-white/10 pt-6 text-white/70 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 pt-20 border-t border-white/10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Didn't find what you're looking for?</h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Contact our team directly for personalized assistance. We're here to help!
            </p>
            <a href="/contact" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
