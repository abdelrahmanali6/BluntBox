import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translate = inject(TranslateService);
    private platformId = inject(PLATFORM_ID);

    private readonly LANG_KEY = 'bb_lang';

    // Current language signal
    currentLang = signal<'en' | 'ar'>('en');

    // RTL state signal
    isRtl = signal<boolean>(false);

    constructor() {
        registerLocaleData(localeAr, 'ar');
        this.translate.setDefaultLang('en');
        this.initLanguage();
    }

    private initLanguage() {
        if (isPlatformBrowser(this.platformId)) {
            const savedLang = localStorage.getItem(this.LANG_KEY) as 'en' | 'ar';
            const browserLang = navigator.language.split('-')[0];
            const defaultLang = savedLang || (browserLang === 'ar' ? 'ar' : 'en');

            this.setLanguage(defaultLang);
        } else {
            this.translate.setDefaultLang('en');
            this.translate.use('en');
        }
    }

    setLanguage(lang: 'en' | 'ar') {
        this.currentLang.set(lang);
        this.translate.use(lang);
        this.isRtl.set(lang === 'ar');

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.LANG_KEY, lang);
            this.updateHtmlDoc(lang);
        }
    }

    private updateHtmlDoc(lang: 'en' | 'ar') {
        const html = document.getElementsByTagName('html')[0];
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Manage fonts
        if (lang === 'ar') {
            document.body.classList.add('font-arabic');
        } else {
            document.body.classList.remove('font-arabic');
        }
    }
}
