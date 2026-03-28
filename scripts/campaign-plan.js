const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const redColor = "E31B23";

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: redColor },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: redColor },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // ===== TITLE =====
      new Paragraph({
        children: [new TextRun({ text: "SIEDEL'S BARBERSHOP", bold: true, size: 36, color: redColor })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Marketing Campaign Plan: Website Launch", size: 24, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),

      // ===== CAMPAIGN OVERVIEW =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Campaign Overview")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Campaign Name: ", bold: true }), new TextRun("Elite Precision Launch")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Campaign Summary: ", bold: true }), new TextRun("Position Siedel's as the premier luxury barbershop in Medina through SEO-optimized website copy, Google Business Profile mastery, and strategic word-of-mouth activation.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Primary Objective: ", bold: true }), new TextRun("Drive 30–50 new booking inquiries within Week 1–2 of website launch, establish #1–2 ranking in Google Business Profile for 'barbershop near me' and 'luxury haircut' keywords in Medina.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Secondary Objectives: ", bold: true }), new TextRun("Generate 5–10 new Google reviews, reach 200–300 website visitors, establish brand authority as local luxury grooming expert.")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== TARGET AUDIENCE =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Target Audience")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Primary Segment: ", bold: true }), new TextRun("Affluent males, ages 28–55, in Medina area with disposable income for premium grooming services.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Pain Points: ", bold: true }), new TextRun("Tired of generic chain barbershops, difficulty finding artisan-quality craftsmanship, want personalized service and genuine expertise.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Motivations: ", bold: true }), new TextRun("Status & appearance, craftsmanship appreciation, local/independent business support, reputation and authority in their field.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Where They Discover Services: ", bold: true }), new TextRun("Google search, Google Business Profile, word-of-mouth referrals, local networking, LinkedIn.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Buying Stage: ", bold: true }), new TextRun("Mix of awareness ('best barbershop near me') and decision stage (ready to book premium service); strong influence from reviews and portfolio.")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== KEY MESSAGES =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Key Messages")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Core Message: ", bold: true }), new TextRun("\"Precision grooming for the modern elite. We don't just cut hair; we engineer identity.\"")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),
      new Paragraph({
        children: [new TextRun({ text: "Supporting Message 1 – Mastery & Expertise: ", bold: true }), new TextRun("\"Our artisans average 15+ years of specialized training. Every cut reflects decades of precision.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Supporting Message 2 – Luxury Brutalism: ", bold: true }), new TextRun("\"Raw materials, honest craftsmanship, uncompromising design. No shortcuts, no gimmicks.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Supporting Message 3 – Local Authority: ", bold: true }), new TextRun("\"14 years serving Medina's most discerning men. 4.5★ across 276 reviews. Your neighbors' trusted choice.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Supporting Message 4 – Personalized Service: ", bold: true }), new TextRun("\"Not a number. Not a commodity. Your style, your ritual, your barber. Continuity and relationship.\"")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== WEBSITE COPY STRATEGY =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Website Copy Strategy")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Hero Section (Above Fold)")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Headline: ", bold: true }), new TextRun("\"Precision Grooming for the Modern Elite\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Subheading: ", bold: true }), new TextRun("\"Artisan barbering in Medina. 14 years of mastery. Where craftsmanship meets luxury.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "CTA Button: ", bold: true }), new TextRun("\"Book Your Precision Cut\" (links to Calendly or booking form)")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Services Section")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Precision Cut ($45–75): ", bold: true }), new TextRun("\"Engineered for your hair type and lifestyle. Not a template. A blueprint.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Elite Shave ($40–55): ", bold: true }), new TextRun("\"Hot towel, straight razor technique, skin analysis. A ritual, not a service.\"")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Artisanal Ritual ($75+): ", bold: true }), new TextRun("\"Complete grooming experience: cut, shave, beard sculpting, scalp treatment. 90 minutes of mastery.\"")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Artisans Section (Social Proof + Expertise)")]
      }),
      new Paragraph({
        children: [new TextRun("Feature each artisan with: name, title, specialty, years of experience, philosophy. Builds trust and differentiation.")]
      }),
      new Paragraph({
        children: [new TextRun("Include photos (high-quality, professional, brutalist aesthetic).")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== CONTENT CALENDAR =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Week 1–2 Rapid Execution Calendar")]
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 2800, 2600, 1560],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, shading: { fill: redColor, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Day", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: redColor, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Task", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, shading: { fill: redColor, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Channel/Asset", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: redColor, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Owner", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Mon")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Optimize Google Business Profile + add local keywords")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("GBP")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Owner")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Tue")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Launch website with hero copy + schema markup")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Website")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Dev")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Wed")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Internal email to recent clients: request reviews + word-of-mouth")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Email")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Mgmt")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Thu")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Publish 'Artisan Spotlight' blog posts (2–3 pieces on artisans)")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Blog")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Marketing")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Fri")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Local outreach: LinkedIn network + neighbor referral incentive")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Social/Email")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Mgmt")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Sat")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("In-shop signage + QR to booking (track offline→online)")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Collateral")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Design")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Sun")] })] }),
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Monitor analytics + respond to review comments")] })] }),
              new TableCell({ borders, width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("GBP/Analytics")] })] }),
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Owner")] })] })
            ]
          })
        ]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== 10 SEO QUICK WINS =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("10 SEO Quick Wins (Execute in Week 1)")]
      }),
      new Paragraph({
        children: [new TextRun("1. "), new TextRun({ text: "Google Business Profile Optimization", bold: true }), new TextRun(" – Add 'luxury barbershop Medina', 'precision haircut', service descriptions with keywords, 8+ high-quality photos")]
      }),
      new Paragraph({
        children: [new TextRun("2. "), new TextRun({ text: "Schema Markup", bold: true }), new TextRun(" – Implement LocalBusiness + Service schema on website (barbershop type, address, phone, hours, services with prices)")]
      }),
      new Paragraph({
        children: [new TextRun("3. "), new TextRun({ text: "Meta Title & Description Optimization", bold: true }), new TextRun(" – Homepage: 'Luxury Barbershop in Medina | Precision Haircuts & Elite Shaves' (include target keywords)")]
      }),
      new Paragraph({
        children: [new TextRun("4. "), new TextRun({ text: "Mobile Optimization", bold: true }), new TextRun(" – Ensure site is fully responsive; one-click booking button above fold")]
      }),
      new Paragraph({
        children: [new TextRun("5. "), new TextRun({ text: "Internal Linking Strategy", bold: true }), new TextRun(" – Link service pages to artisan spotlight blogs; homepage to booking")]
      }),
      new Paragraph({
        children: [new TextRun("6. "), new TextRun({ text: "Review Generation Campaign", bold: true }), new TextRun(" – Email existing clients with direct Google Review link + incentive (e.g., 10% off next visit)")]
      }),
      new Paragraph({
        children: [new TextRun("7. "), new TextRun({ text: "Blog Content for Long-Tail Keywords", bold: true }), new TextRun(" – 'Best Barbers in Medina', 'How to Choose a Luxury Barbershop', 'Straight Razor Shave Benefits'")]
      }),
      new Paragraph({
        children: [new TextRun("8. "), new TextRun({ text: "Local Citations", bold: true }), new TextRun(" – Ensure accurate NAP (Name, Address, Phone) across Yelp, Apple Maps, local directories")]
      }),
      new Paragraph({
        children: [new TextRun("9. "), new TextRun({ text: "Page Speed Optimization", bold: true }), new TextRun(" – Compress images, enable caching, optimize CSS/JS; target <2 second load time")]
      }),
      new Paragraph({
        children: [new TextRun("10. "), new TextRun({ text: "Call-to-Action CTA Optimization", bold: true }), new TextRun(" – Multiple 'Book Now' CTAs above fold, sidebar, and footer; track click-through rate")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== SUCCESS METRICS =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Success Metrics & KPIs")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Week 1–2 Targets")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Booking Inquiries: ", bold: true }), new TextRun("30–50 new inquiry forms or calls")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Google Reviews: ", bold: true }), new TextRun("5–10 new verified reviews")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Website Traffic: ", bold: true }), new TextRun("200–300 monthly visitors")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "GBP Visibility: ", bold: true }), new TextRun("Top 3 ranking for 'barbershop near me' in Medina")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Engagement Rate: ", bold: true }), new TextRun(">3% click-through on website CTAs")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Month 1 Targets")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Booked Appointments: ", bold: true }), new TextRun("80–120 new clients (15–20 per week)")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "GBP Ranking: ", bold: true }), new TextRun("#1–2 for primary keywords")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Total Reviews: ", bold: true }), new TextRun("280–300 (maintain 4.5★+)")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Monthly Website Traffic: ", bold: true }), new TextRun("600–800 visits")]
      }),
      new Paragraph({
        children: [new TextRun("• "), new TextRun({ text: "Customer Acquisition Cost (CAC): ", bold: true }), new TextRun("$0 (organic-only, track referral source)")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== RISKS & MITIGATIONS =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Risks & Mitigations")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Risk 1 – Slow Review Accumulation: ", bold: true }), new TextRun("Current 276 reviews may discourage new customers from leaving reviews.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Mitigation: ", bold: true }), new TextRun("Offer 10% incentive for Google reviews; send review request email within 48 hours of appointment.")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        children: [new TextRun({ text: "Risk 2 – GBP Algorithm Competition: ", bold: true }), new TextRun("Competitors may also be optimizing; organic rank gains take 2–4 weeks.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Mitigation: ", bold: true }), new TextRun("Focus on review velocity and GBP engagement (responding to reviews, posts). Add 'Appointment Booking' feature in GBP.")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),

      new Paragraph({
        children: [new TextRun({ text: "Risk 3 – Website Technical Issues: ", bold: true }), new TextRun("Booking form, schema markup, or mobile responsiveness problems could reduce conversions.")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Mitigation: ", bold: true }), new TextRun("Test booking form daily; monitor Core Web Vitals in Google Search Console; A/B test CTA copy.")]
      }),
      new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

      // ===== NEXT STEPS =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Next Steps")]
      }),
      new Paragraph({
        children: [new TextRun("1. "), new TextRun({ text: "This Week: ", bold: true }), new TextRun("Finalize website copy; implement schema markup; optimize GBP")]
      }),
      new Paragraph({
        children: [new TextRun("2. "), new TextRun({ text: "Launch Day: ", bold: true }), new TextRun("Deploy website; send internal review request email; activate GBP appointment booking")]
      }),
      new Paragraph({
        children: [new TextRun("3. "), new TextRun({ text: "Week 2: ", bold: true }), new TextRun("Monitor GBP analytics, website traffic, booking conversions; respond to all reviews (positive & constructive)")]
      }),
      new Paragraph({
        children: [new TextRun("4. "), new TextRun({ text: "Month 1 Review: ", bold: true }), new TextRun("Assess KPIs, adjust strategy based on top-performing keywords and review insights")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/zen-clever-heisenberg/mnt/siedels/Siedels_Campaign_Plan.docx", buffer);
  console.log("✓ Campaign plan generated: Siedels_Campaign_Plan.docx");
});
