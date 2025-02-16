import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maaş Hesaplama",
  description: "Hızlı ve kolay mesai hesaplama aracı",
};

const trLocale = {
    title: "Başlık",
    subtitle: "Alt Başlık",
    form: {
        baseSalary: {
            label: "Taban Maaş",
            tooltip: "Aylık maaş",
            placeholder: "Maaşınızı girin"
        },
        period: {
            label: "Dönem",
            selectMonth: "Ayı seçin"
        },
        totalWorkHours: {
            label: "Toplam Çalışma Saati",
            tooltip: "Aylık toplam çalışma saati"
        },
        holidayWork: {
            label: "Tatil Çalışması",
            tooltip: "Tatil günlerinde çalışılan saat"
        }
    },
    buttons: {
        calculate: "Hesapla"
    },
    results: {
        title: "Sonuçlar"
    },
    history: {
        title: "Geçmiş",
        empty: "Geçmiş kayıt yok",
        period: "Dönem"
    },
    months: {
        january: "Ocak",
        // diğer aylar...
    }
};

const enLocale = {
    title: "Title",
    subtitle: "Subtitle",
    form: {
        baseSalary: {
            label: "Base Salary",
            tooltip: "Monthly salary",
            placeholder: "Enter your salary"
        },
        period: {
            label: "Period",
            selectMonth: "Select month"
        },
        totalWorkHours: {
            label: "Total Work Hours",
            tooltip: "Total working hours per month"
        },
        holidayWork: {
            label: "Holiday Work",
            tooltip: "Hours worked on holidays"
        }
    },
    buttons: {
        calculate: "Calculate"
    },
    results: {
        title: "Results"
    },
    history: {
        title: "History",
        empty: "No history records",
        period: "Period"
    },
    months: {
        january: "January",
        // other months...
    }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
