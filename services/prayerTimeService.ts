
interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

// A Map to normalize city names from Arabic to English for the API call.
const cityMap: Map<string, string> = new Map([
    ["الرياض", "Riyadh"],
    ["رياض", "Riyadh"],
    ["مكة", "Makkah"],
    ["مكة المكرمة", "Makkah"],
    ["المدينة المنورة", "Madinah"],
    ["المدينه", "Madinah"],
    ["مدينة", "Madinah"],
    ["جدة", "Jeddah"],
    ["جده", "Jeddah"],
    ["الدمام", "Dammam"],
    ["دمام", "Dammam"],
    ["الهفوف", "Hofuf"],
    ["الطائف", "Taif"],
    ["طايف", "Taif"],
    ["تبوك", "Tabuk"],
    ["بريدة", "Buraydah"],
    ["خميس مشيط", "Khamis Mushait"],
    ["الجبيل", "Jubail"],
    ["حائل", "Hail"],
    ["حايل", "Hail"],
    ["نجران", "Najran"],
    ["أبها", "Abha"],
    ["ينبع", "Yanbu"],
    ["الخبر", "Khobar"],
    ["عنيزة", "Unayzah"],
    ["عرعر", "Arar"],
    ["سكاكا", "Sakaka"],
    ["جازان", "Jazan"],
]);


export const fetchPrayerTimes = async (city: string): Promise<PrayerTimes | string> => {
    // Normalize the city name to handle variations
    const englishCity = cityMap.get(city.trim()) || city;

    try {
        // Method 4 is for Umm al-Qura University, Makkah, standard for KSA.
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${englishCity}&country=SA&method=4`);
        if (!response.ok) {
            return `لم أتمكن من العثور على أوقات الصلاة لمدينة "${city}". يرجى التأكد من اسم المدينة.`;
        }
        const data = await response.json();
        if (data.code === 200) {
            const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
            return { Fajr, Dhuhr, Asr, Maghrib, Isha };
        } else {
             return `لم أتمكن من العثور على أوقات الصلاة لمدينة "${city}". يرجى التأكد من اسم المدينة.`;
        }
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        return "حدث خطأ أثناء محاولة جلب أوقات الصلاة. يرجى المحاولة مرة أخرى.";
    }
};
