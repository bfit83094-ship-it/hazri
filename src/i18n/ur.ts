export interface I18nDictionary {
  appName: string;
  appShortName: string;
  tagline: string;

  nav: {
    attendance: string;
    lessons: string;
    students: string;
    settings: string;
    classes: string;
    primaryAria: string;
    sideAria: string;
  };

  auth: {
    googleButton: string;
    signingIn: string;
    loginError: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmBody: string;
    setupTitle: string;
    setupPrefix: string;
    setupAnd: string;
    setupSuffix: string;
    previewButton: string;
    previewHint: string;
    previewBanner: string;
    exitPreview: string;
  };

  common: {
    loading: string;
    retry: string;
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    confirm: string;
    search: string;
    allClasses: string;
    today: string;
    back: string;
    optional: string;
    required: string;
    offlineBanner: string;
    notFoundTitle: string;
    notFoundBody: string;
    goHome: string;
    prevDay: string;
    nextDay: string;
    selectDate: string;
    showMore: string;
  };

  attendance: {
    title: string;
    present: string;
    absent: string;
    leave: string;
    unmarked: string;
    markAllPresent: string;
    allMarkedToast: string;
    futureWarning: string;
    noStudentsTitle: string;
    noStudentsBody: string;
    addFirstStudent: string;
    noClassStudents: string;
  };

  lessons: {
    title: string;
    sabaq: string;
    sabqi: string;
    manzil: string;
    heard: string;
    notHeard: string;
    notRecorded: string;
    lines: string;
    mistakes: string;
    grade: string;
    note: string;
    notePlaceholder: string;
    nextStudent: string;
    absentBadge: string;
    leaveBadge: string;
    decrease: string;
    increase: string;
    grades: {
      acha: string;
      theek: string;
      kamzor: string;
    };
  };

  students: {
    title: string;
    addStudent: string;
    editStudent: string;
    nameLabel: string;
    namePlaceholder: string;
    classLabel: string;
    fatherNameLabel: string;
    fatherNamePlaceholder: string;
    rollNoLabel: string;
    rollNoPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    showArchived: string;
    archivedTag: string;
    archive: string;
    unarchive: string;
    manageClasses: string;
    deleteTitle: string;
    deleteBody: string;
    emptySearch: string;
    nameRequiredError: string;
    classRequiredError: string;
    createdToast: string;
    updatedToast: string;
    archivedToast: string;
    restoredToast: string;
    deletedToast: string;
  };

  studentDetail: {
    title: string;
    attendancePct: string;
    sabaqDays: string;
    avgLines: string;
    presentCount: string;
    absentCount: string;
    leaveCount: string;
    rangeWeek: string;
    rangeMonth: string;
    rangeAll: string;
    rangeCustom: string;
    fromDate: string;
    toDate: string;
    historyTitle: string;
    noRecords: string;
    editDayTitle: string;
    tapToEdit: string;
    studentNotFound: string;
  };

  classes: {
    title: string;
    addClass: string;
    editClass: string;
    nameLabel: string;
    namePlaceholder: string;
    moveUp: string;
    moveDown: string;
    studentSingular: string;
    studentCountSuffix: string;
    deleteTitle: string;
    deleteBody: string;
    deleteBlockedError: string;
    nameRequiredError: string;
    duplicateNameError: string;
    createdToast: string;
    updatedToast: string;
    deletedToast: string;
    emptyTitle: string;
  };

  settings: {
    title: string;
    accountSection: string;
    languageSection: string;
    languageHint: string;
    urduOption: string;
    romanOption: string;
    installSection: string;
    installButton: string;
    installedBadge: string;
    manualInstallTitle: string;
    manualInstallAndroid: string;
    manualInstallIOS: string;
    classesLinkTitle: string;
    classesLinkSubtitle: string;
    installBannerText: string;
    dismiss: string;
  };

  weekdays: readonly [string, string, string, string, string, string, string];
  months: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
}

export const ur: I18nDictionary = {
  appName: 'مدرسہ حاضری',
  appShortName: 'حاضری',
  tagline: 'حاضری اور سبق کا مکمل ریکارڈ',

  nav: {
    attendance: 'حاضری',
    lessons: 'سبق',
    students: 'طلبہ',
    settings: 'ترتیبات',
    classes: 'کلاسز',
    primaryAria: 'بنیادی نیویگیشن',
    sideAria: 'سائیڈ مینو',
  },

  auth: {
    googleButton: 'گوگل سے لاگ اِن کریں',
    signingIn: 'لاگ اِن ہو رہا ہے…',
    loginError: 'لاگ اِن نہیں ہو سکا، دوبارہ کوشش کریں',
    logout: 'لاگ آؤٹ',
    logoutConfirmTitle: 'لاگ آؤٹ کریں؟',
    logoutConfirmBody: 'کیا آپ واقعی اپنے اکاؤنٹ سے لاگ آؤٹ کرنا چاہتے ہیں؟',
    setupTitle: 'سپابیس کنفیگریشن درکار ہے',
    setupPrefix: 'لائیو گوگل لاگ اِن اور کلاؤڈ سنک کے لیے ماحولیاتی متغیرات',
    setupAnd: 'اور',
    setupSuffix: 'شامل کریں۔',
    previewButton: 'نمائشی جھلک کھولیں',
    previewHint: 'بغیر اکاؤنٹ کے تمام فیچرز آزمائیں',
    previewBanner: 'نمائشی موڈ فعال ہے — ڈیٹا عارضی ہے',
    exitPreview: 'نمائشی موڈ بند کریں',
  },

  common: {
    loading: 'لوڈ ہو رہا ہے…',
    retry: 'دوبارہ کوشش کریں',
    save: 'محفوظ کریں',
    saving: 'محفوظ ہو رہا ہے…',
    saved: 'محفوظ ہو گیا',
    saveError: 'محفوظ نہیں ہو سکا، دوبارہ کوشش کریں',
    cancel: 'منسوخ کریں',
    close: 'بند کریں',
    edit: 'ترمیم',
    delete: 'حذف کریں',
    confirm: 'تصدیق کریں',
    search: 'تلاش کریں…',
    allClasses: 'تمام کلاسز',
    today: 'آج',
    back: 'واپس',
    optional: 'اختیاری',
    required: 'ضروری',
    offlineBanner: 'انٹرنیٹ نہیں ہے — ڈیٹا محفوظ کرنے کے لیے انٹرنیٹ درکار ہے',
    notFoundTitle: 'صفحہ نہیں ملا',
    notFoundBody: 'مطلوبہ صفحہ موجود نہیں ہے۔',
    goHome: 'حاضری پر جائیں',
    prevDay: 'پچھلا دن',
    nextDay: 'اگلا دن',
    selectDate: 'تاریخ منتخب کریں',
    showMore: 'مزید دکھائیں',
  },

  attendance: {
    title: 'روزانہ حاضری',
    present: 'حاضر',
    absent: 'غائب',
    leave: 'رخصت',
    unmarked: 'باقی',
    markAllPresent: 'سب حاضر',
    allMarkedToast: 'تمام باقی طلبہ حاضر لگ گئے',
    futureWarning: 'آنے والی تاریخ کی حاضری نہیں لگ سکتی',
    noStudentsTitle: 'ابھی کوئی طالب علم شامل نہیں',
    noStudentsBody: 'روزانہ حاضری لگانے کے لیے پہلے طالب علم شامل کریں۔',
    addFirstStudent: 'پہلا طالب علم شامل کریں',
    noClassStudents: 'اس کلاس میں کوئی فعال طالب علم نہیں ہے۔',
  },

  lessons: {
    title: 'سبق، سبقی اور منزل',
    sabaq: 'سبق',
    sabqi: 'سبقی',
    manzil: 'منزل',
    heard: 'سنایا',
    notHeard: 'نہیں سنایا',
    notRecorded: 'درج نہیں',
    lines: 'لائنیں',
    mistakes: 'غلطیاں',
    grade: 'گریڈ',
    note: 'نوٹ (پارہ / سورۃ / کیفیت)',
    notePlaceholder: 'مثلاً: پارہ 3، سورۃ البقرہ آیت 255 یا استاد کی رائے',
    nextStudent: 'اگلا طالب علم',
    absentBadge: 'غائب',
    leaveBadge: 'رخصت',
    decrease: 'کم کریں',
    increase: 'بڑھائیں',
    grades: {
      acha: 'اچھا',
      theek: 'ٹھیک',
      kamzor: 'کمزور',
    },
  },

  students: {
    title: 'طلبہ',
    addStudent: 'نیا طالب علم',
    editStudent: 'طالب علم میں ترمیم',
    nameLabel: 'طالب علم کا نام',
    namePlaceholder: 'مثلاً: محمد عبداللہ',
    classLabel: 'کلاس',
    fatherNameLabel: 'والد کا نام',
    fatherNamePlaceholder: 'مثلاً: محمد احمد',
    rollNoLabel: 'رول نمبر',
    rollNoPlaceholder: 'مثلاً: 101',
    phoneLabel: 'فون نمبر',
    phonePlaceholder: 'مثلاً: 03001234567',
    showArchived: 'آرکائیو شدہ دکھائیں',
    archivedTag: 'آرکائیو شدہ',
    archive: 'آرکائیو کریں',
    unarchive: 'بحال کریں',
    manageClasses: 'کلاسز کا انتظام',
    deleteTitle: 'طالب علم حذف کریں؟',
    deleteBody:
      'اس طالب علم کی تمام حاضری اور سبق کا ریکارڈ ہمیشہ کے لیے ختم ہو جائے گا۔ کیا آپ واقعی حذف کرنا چاہتے ہیں؟',
    emptySearch: 'تلاش کے مطابق کوئی طالب علم نہیں ملا۔',
    nameRequiredError: 'طالب علم کا نام ضروری ہے (1 سے 100 حروف)',
    classRequiredError: 'کلاس منتخب کرنا ضروری ہے',
    createdToast: 'طالب علم شامل ہو گیا',
    updatedToast: 'طالب علم کی معلومات محفوظ ہو گئیں',
    archivedToast: 'طالب علم آرکائیو ہو گیا',
    restoredToast: 'طالب علم بحال ہو گیا',
    deletedToast: 'طالب علم حذف ہو گیا',
  },

  studentDetail: {
    title: 'طالب علم کا ریکارڈ',
    attendancePct: 'حاضری فیصد',
    sabaqDays: 'سبق سنائے (دن)',
    avgLines: 'اوسط لائنیں',
    presentCount: 'حاضر',
    absentCount: 'غائب',
    leaveCount: 'رخصت',
    rangeWeek: 'ہفتہ',
    rangeMonth: 'مہینہ',
    rangeAll: 'سب',
    rangeCustom: 'مخصوص',
    fromDate: 'تاریخ سے',
    toDate: 'تاریخ تک',
    historyTitle: 'تاریخ وار ریکارڈ',
    noRecords: 'ابھی کوئی ریکارڈ نہیں',
    editDayTitle: 'دن کا ریکارڈ تبدیل کریں',
    tapToEdit: 'ترمیم کے لیے دبائیں',
    studentNotFound: 'طالب علم نہیں ملا',
  },

  classes: {
    title: 'کلاسز کا انتظام',
    addClass: 'نئی کلاس شامل کریں',
    editClass: 'کلاس کا نام تبدیل کریں',
    nameLabel: 'کلاس کا نام',
    namePlaceholder: 'مثلاً: درجہ ناظرہ',
    moveUp: 'اوپر لے جائیں',
    moveDown: 'نیچے لے جائیں',
    studentSingular: 'طالب علم',
    studentCountSuffix: 'طلبہ',
    deleteTitle: 'کلاس حذف کریں؟',
    deleteBody: 'کیا آپ واقعی یہ کلاس حذف کرنا چاہتے ہیں؟',
    deleteBlockedError:
      'اس کلاس میں طلبہ موجود ہیں، پہلے انہیں دوسری کلاس میں منتقل کریں',
    nameRequiredError: 'کلاس کا نام ضروری ہے',
    duplicateNameError: 'اس نام کی کلاس پہلے سے موجود ہے',
    createdToast: 'کلاس شامل ہو گئی',
    updatedToast: 'کلاس کا نام تبدیل ہو گیا',
    deletedToast: 'کلاس حذف ہو گئی',
    emptyTitle: 'کوئی کلاس موجود نہیں',
  },

  settings: {
    title: 'ترتیبات',
    accountSection: 'استاد کا اکاؤنٹ',
    languageSection: 'زبان',
    languageHint: 'اردو یا رومن اردو منتخب کریں',
    urduOption: 'اردو',
    romanOption: 'Roman',
    installSection: 'موبائل ایپ انسٹال',
    installButton: 'ایپ انسٹال کریں',
    installedBadge: 'ایپ انسٹال ہے',
    manualInstallTitle: 'فون پر انسٹال کرنے کا طریقہ',
    manualInstallAndroid:
      'اینڈرائیڈ (Chrome): اوپر دائیں کونے میں ⋮ مینو کھولیں اور "Install app" یا "Add to Home screen" دبائیں۔',
    manualInstallIOS:
      'آئی فون (Safari): نیچے Share بٹن دبائیں، پھر "Add to Home Screen" منتخب کریں۔',
    classesLinkTitle: 'کلاسز کا انتظام',
    classesLinkSubtitle: 'کلاسز شامل کریں، نام بدلیں یا ترتیب دیں',
    installBannerText: 'بہتر تجربے کے لیے ایپ فون پر انسٹال کریں',
    dismiss: 'بعد میں',
  },

  weekdays: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  months: [
    'جنوری',
    'فروری',
    'مارچ',
    'اپریل',
    'مئی',
    'جون',
    'جولائی',
    'اگست',
    'ستمبر',
    'اکتوبر',
    'نومبر',
    'دسمبر',
  ],
};
