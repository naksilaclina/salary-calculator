// Sabit değerler
const NORMAL_MESAI_CARPANI = 1.5
const TATIL_MESAI_CARPANI = 2.0
const AYLIK_CALISMA_SAATI = 225

interface HesaplamaParametreleri {
    tabanMaas: number
    ay: number
    yil: number
    toplamCalisma: number
    tatilVarMi: boolean
    tatilMesai: number
}

interface HesaplamaSonuclari {
    saatlikUcret: number
    normalMesai: number
    tatilMesai: number
    normalMesaiUcret: number
    tatilMesaiUcret: number
    toplamMesaiUcret: number
    netMaas: number
}

// Minimum çalışma süresini hesapla
export function hesaplaMinimumCalisma(yil: number, ay: number): number {
    const gunSayisi = new Date(yil, ay, 0).getDate()
    let haftaSonuGunleri = 0

    for (let gun = 1; gun <= gunSayisi; gun++) {
        const tarih = new Date(yil, ay - 1, gun)
        if (tarih.getDay() === 0 || tarih.getDay() === 6) { // 0: Pazar, 6: Cumartesi
            haftaSonuGunleri++
        }
    }

    const calismaGunu = gunSayisi - haftaSonuGunleri
    return calismaGunu * 9 // Günlük 9 saat çalışma
}

// Ana hesaplama fonksiyonu
export function hesaplaMaas({
    tabanMaas,
    ay,
    yil,
    toplamCalisma,
    tatilVarMi,
    tatilMesai
}: HesaplamaParametreleri): HesaplamaSonuclari {
    // Validasyonlar
    if (tabanMaas <= 0) throw new Error('Taban maaş 0\'dan büyük olmalıdır')
    if (ay < 1 || ay > 12) throw new Error('Geçerli bir ay seçiniz')
    if (yil < 2020) throw new Error('2020\'den önceki yıllar için hesaplama yapılamaz')
    if (toplamCalisma < 0) throw new Error('Toplam çalışma saati 0\'dan küçük olamaz')
    if (tatilMesai < 0) throw new Error('Tatil mesai saati 0\'dan küçük olamaz')
    if (tatilVarMi && tatilMesai === 0) throw new Error('Tatil çalışması var ancak saat girilmemiş')
    if (!tatilVarMi && tatilMesai > 0) throw new Error('Tatil çalışması yok ancak saat girilmiş')

    // Değerlerin mantıklı aralıkta olup olmadığını kontrol et
    if (tabanMaas < 11402) { // 2024 asgari ücret
        throw new Error("Taban maaş asgari ücretten az olamaz!")
    }

    if (toplamCalisma < 0 || toplamCalisma > 400) { // Aylık makul üst sınır
        throw new Error("Geçersiz toplam çalışma saati!")
    }

    if (tatilMesai < 0 || tatilMesai > toplamCalisma) {
        throw new Error("Geçersiz resmi tatil mesai saati!")
    }

    // 1. Saatlik ücret hesaplama
    const saatlikUcret = tabanMaas / AYLIK_CALISMA_SAATI

    // 2. Minimum çalışma süresinin hesaplanması
    const minCalisma = hesaplaMinimumCalisma(yil, ay)

    // 3. Normal mesai süresinin hesaplanması
    const normalMesai = toplamCalisma - minCalisma - tatilMesai
    
    // Minimum çalışma süresinden az çalışma durumu
    if (normalMesai < 0) {
        // Eksik çalışma saati hesaplama (tatil mesai hariç)
        const eksikCalisma = Math.abs(normalMesai)
        
        // Normal saatlik ücret üzerinden kesinti
        const kesinti = eksikCalisma * saatlikUcret
        
        // 4. Mesai ücretlerinin hesaplanması (sadece tatil mesai)
        const normalMesaiUcret = 0 // Eksik çalışmada normal mesai ücreti olmaz
        const tatilMesaiUcret = tatilMesai * (saatlikUcret * TATIL_MESAI_CARPANI)
        const toplamMesaiUcret = tatilMesaiUcret
        
        // 5. Net maaş hesaplama (kesinti dahil)
        const netMaas = tabanMaas + toplamMesaiUcret - kesinti

        return {
            saatlikUcret,
            normalMesai: -eksikCalisma, // Eksi değer olarak eksik çalışmayı göster
            tatilMesai,
            normalMesaiUcret,
            tatilMesaiUcret,
            toplamMesaiUcret,
            netMaas
        }
    }

    // Normal durum (fazla mesai varsa)
    // 4. Mesai ücretlerinin hesaplanması
    const normalMesaiUcret = normalMesai * (saatlikUcret * NORMAL_MESAI_CARPANI)
    const tatilMesaiUcret = tatilMesai * (saatlikUcret * TATIL_MESAI_CARPANI)
    const toplamMesaiUcret = normalMesaiUcret + tatilMesaiUcret

    // 5. Net maaş hesaplama
    const netMaas = tabanMaas + toplamMesaiUcret

    return {
        saatlikUcret,
        normalMesai,
        tatilMesai,
        normalMesaiUcret,
        tatilMesaiUcret,
        toplamMesaiUcret,
        netMaas
    }
}

// Para formatı
export function formatPara(deger: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(deger)
}

// Saat formatı
export function formatSaat(saat: number): string {
    return `${saat.toFixed(1)}`
} 