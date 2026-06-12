import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Bus,
  CalendarDays,
  ChevronRight,
  Clock,
  Compass,
  Factory,
  FlaskConical,
  Image as ImageIcon,
  Landmark,
  MapPin,
  Mountain,
  Route,
  School,
  Search,
  Sparkles,
  Trophy,
  Users,
  Waves,
  X,
} from 'lucide-react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const screen = Dimensions.get('window');
const isCompact = screen.width < 390;
const isDesktop = screen.width >= 760;
const NativeWebView = Platform.OS === 'web' ? null : require('react-native-webview').WebView;

const programImages = [
  {
    id: 'program-21',
    title: 'Дни 1-2',
    caption: 'Көкшетау и Бурабай',
    source: require('./photo/image.png'),
  },
  {
    id: 'program-22',
    title: 'Дни 2-3',
    caption: 'Бурабай, музеи, наука',
    source: require('./photo/image copy.png'),
  },
  {
    id: 'program-23',
    title: 'Дни 4-6',
    caption: 'Промышленность, спорт, финал',
    source: require('./photo/image copy 2.png'),
  },
];

const categories = [
  { id: 'all', label: 'Все', color: '#164e63', Icon: Compass },
  { id: 'heritage', label: 'История', color: '#b45309', Icon: Landmark },
  { id: 'nature', label: 'Природа', color: '#15803d', Icon: Mountain },
  { id: 'science', label: 'Наука', color: '#2563eb', Icon: FlaskConical },
  { id: 'industry', label: 'Промышленность', color: '#be123c', Icon: Factory },
  { id: 'action', label: 'Спорт и арт', color: '#7c3aed', Icon: Trophy },
];

const days = [
  {
    id: 'all',
    date: 'Весь маршрут',
    title: 'TET-2026',
    short: 'Все',
    accent: '#164e63',
    summary: 'Полная карта экспедиции: НИШ Көкшетау, городские объекты, Бурабай, наука, производство и финал.',
  },
  {
    id: '8',
    date: '8 июня',
    title: 'Көкшетау мұрасы',
    short: 'Культура',
    accent: '#b45309',
    summary: 'Открытие в НИШ, памятники, Мәңгілік алау, вокзал и вечер в театре.',
  },
  {
    id: '9',
    date: '9 июня',
    title: 'Бурабай табиғаты',
    short: 'Бурабай',
    accent: '#15803d',
    summary: 'Природный парк, визит-центр, Жұмбақтас и Абылай хан алаңы.',
  },
  {
    id: '10',
    date: '10 июня',
    title: 'Ғылым және музей',
    short: 'Наука',
    accent: '#2563eb',
    summary: 'Музеи, архивные документы и лаборатории университета.',
  },
  {
    id: '11',
    date: '11 июня',
    title: 'Индустрия және спорт',
    short: 'Город',
    accent: '#be123c',
    summary: 'Городской музей, предприятия, спортшкола и творческий вечер.',
  },
  {
    id: '12',
    date: '12 июня',
    title: 'Жобаның жабылуы',
    short: 'Финал',
    accent: '#7c3aed',
    summary: 'Chocolate ART, спорт, рисунки и салтанатты жабылуы на базе НИШ Көкшетау.',
  },
  {
    id: '13',
    date: '13 июня',
    title: 'Қатысушыларды шығарып салу',
    short: 'Отъезд',
    accent: '#0f766e',
    summary: 'Завершение экспедиции и отправление участников с базы НИШ Көкшетау.',
  },
];

const routePoints = [
  {
    id: 'nis-opening',
    dayId: '8',
    title: 'НИШ Көкшетау: открытие проекта',
    place: 'Ж. Тлеулина, 59',
    time: '10:30',
    category: 'science',
    x: 36,
    y: 27,
    imageIndex: 0,
    imageUrl: 'https://schools.nis.edu.kz/storage/school/752670444_IMG_0553.JPG',
    imageCredit: 'НИШ Кокшетау',
    pinShift: { x: -18, y: -4 },
    description:
      'Базовая точка экспедиции: здесь прошло знакомство с программой и салтанатты ашылуы проекта «Туған елге - тағзым».',
    fact: 'К этой же координате привязаны школьная столовая, квесты, Chocolate ART, закрытие и отъезд участников.',
  },
  {
    id: 'birzhan-sal',
    dayId: '8',
    title: 'Біржан сал ескерткіші',
    place: 'Центральная часть Көкшетау',
    time: '13:30',
    category: 'heritage',
    x: 25,
    y: 53,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/045/7ab41d9f.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Отдельная точка культурного маршрута о Біржан сале, певце и композиторе, связанном с музыкальной традицией Көкше.',
    fact: 'В программе рядом указан и Ақан сері, но на карте они разведены по разным реальным координатам.',
  },
  {
    id: 'akan-seri',
    dayId: '8',
    title: 'Ақан сері ескерткіші',
    place: 'Центральная часть Көкшетау',
    time: '13:40',
    category: 'heritage',
    x: 29,
    y: 55,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/039/0e12aa8f.jpeg',
    imageCredit: 'history-akmola.kz',
    description:
      'Памятник Ақан сері дополняет музыкальную линию маршрута и показывает, как город хранит имена сал-сері.',
    fact: 'Ақан сері известен не только как певец, но и как автор песен, ставших частью казахской музыкальной памяти.',
  },
  {
    id: 'eternal-flame',
    dayId: '8',
    title: 'Мәңгілік алау',
    place: 'Мемориал памяти воинов',
    time: '14:00',
    category: 'heritage',
    x: 27,
    y: 59,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/039/7ebfd9f0.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Мемориальная точка первого дня: разговор о памяти, войне и семейных историях, которые остаются частью городского ландшафта.',
    fact: 'Эта остановка была в программе между памятниками Біржан сал/Ақан сері и Шоқан Уәлиханов.',
  },
  {
    id: 'shokan',
    dayId: '8',
    title: 'Шоқан Уәлиханов ескерткіші',
    place: 'Көкшетау',
    time: '14:25',
    category: 'heritage',
    x: 20,
    y: 49,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/040/72eb993d.png',
    imageCredit: 'history-akmola.kz',
    description:
      'Точка для разговора о науке, путешествиях и казахской интеллигенции XIX века.',
    fact: 'Шоқан Уәлиханов был исследователем, этнографом и офицером, поэтому эта остановка хорошо связывает историю и исследовательскую тему TET.',
  },
  {
    id: 'abylai',
    dayId: '8',
    title: 'Абылай хан ескерткіші',
    place: 'Абай көшесі',
    time: '15:40',
    category: 'heritage',
    x: 32,
    y: 47,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/039/a87b0714.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Ключевой исторический акцент городского дня и сильная точка для маршрута памяти.',
    fact: 'Абылай хан связан с североказахстанскими преданиями и Бурабаем, поэтому точка заранее готовит переход к природно-историческому дню.',
  },
  {
    id: 'begeldinov',
    dayId: '8',
    title: 'Талғат Бегелдинов ескерткіші',
    place: 'Көкшетау',
    time: '17:00',
    category: 'heritage',
    x: 30,
    y: 46,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/038/07464a54.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Памятник дважды Герою Советского Союза Талгату Бегелдинову входит во вторую городскую экскурсию первого дня.',
    fact: 'Бегелдинов был летчиком-штурмовиком; эта точка добавляет в маршрут тему мужества и авиации.',
  },
  {
    id: 'mother-stela',
    dayId: '8',
    title: '«Ананың ақ тілегі» стеласы',
    place: 'Көкшетау-1 вокзалы',
    time: '17:30',
    category: 'heritage',
    x: 66,
    y: 44,
    imageIndex: 0,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/037/0a8b9a8a.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Стела у вокзала завершает дневную городскую экскурсию и связывает тему дороги с образом материнского благословения.',
    fact: 'Название переводится как «белое пожелание матери» - мягкий символ начала пути и возвращения домой.',
  },
  {
    id: 'theatre',
    dayId: '8',
    title: 'Музыкально-драматический театр им. Ш. Кусаинова',
    place: 'М. Әуезов көшесі, 216',
    time: '18:30',
    category: 'heritage',
    x: 31,
    y: 45,
    imageIndex: 0,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Akmola_Regional_Kazakh_Music_and_Drama_Theatre_named_after_Shahmet_Kussainov_%28Kokshetau%2C_Akmola_Region%2C_Kazakhstan%3B_July%2C_2021%29.jpg/1280px-Akmola_Regional_Kazakh_Music_and_Drama_Theatre_named_after_Shahmet_Kussainov_%28Kokshetau%2C_Akmola_Region%2C_Kazakhstan%3B_July%2C_2021%29.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Вечерняя программа после экскурсии: культурное завершение первого дня маршрута.',
    fact: 'Театр носит имя драматурга Шахмета Кусаинова и находится рядом с несколькими центральными точками первого дня.',
  },
  {
    id: 'burabay-road',
    dayId: '9',
    title: 'Бурабай ұлттық паркіне жол',
    place: 'Бурабай',
    time: '09:00',
    category: 'nature',
    x: 72,
    y: 30,
    imageIndex: 1,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5_%D0%B8_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.JPG/1280px-%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5_%D0%B8_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.JPG',
    imageCredit: 'Wikimedia Commons',
    description:
      'Переезд в природную часть экспедиции: от школьной базы к озерам, лесам и скальным панорамам Бурабая.',
    fact: 'Бурабай часто называют казахстанской Швейцарией из-за сочетания хвойного леса, озер и гранитных скал.',
  },
  {
    id: 'maral',
    dayId: '9',
    title: 'Aqmaral марал өсіру шаруашылығы',
    place: 'Зеленый Бор маңы',
    time: '10:00',
    category: 'nature',
    x: 88,
    y: 26,
    imageIndex: 1,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%BE%D0%BB%D0%B5%D0%BD%D1%8F.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Экскурсия на мараловодческое хозяйство как часть экологического блока маршрута.',
    fact: 'Марал - крупный олень; такие хозяйства помогают говорить с участниками о биоразнообразии и ответственном туризме.',
  },
  {
    id: 'visit-center',
    dayId: '9',
    title: 'Бурабай визит-орталығы',
    place: 'Бурабай ұлттық паркі',
    time: '12:30',
    category: 'nature',
    x: 78,
    y: 39,
    imageIndex: 1,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/%D0%9E%D0%BA%D0%B6%D0%B5%D1%82%D0%BF%D0%B5%D1%81_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.jpg/1280px-%D0%9E%D0%BA%D0%B6%D0%B5%D1%82%D0%BF%D0%B5%D1%81_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Старт обзорной экскурсии по национальному парку: правила территории, маршрут прогулки и ориентиры для команд.',
    fact: 'На этой точке удобно объяснить, почему Бурабай одновременно природная, историческая и туристическая территория.',
  },
  {
    id: 'jumbaktas',
    dayId: '9',
    title: 'Жұмбақтас',
    place: 'Көгілдір шығанақ',
    time: '13:20',
    category: 'nature',
    x: 69,
    y: 38,
    imageIndex: 1,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/53/%D0%96%D1%83%D0%BC%D0%B1%D0%B0%D0%BA%D1%82%D0%B0%D1%81_%D0%B8_%D0%9E%D0%BA%D0%B6%D0%B5%D1%82%D0%BF%D0%B5%D1%81.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Скала на воде - один из самых узнаваемых образов Бурабая и сильная визуальная точка маршрута.',
    fact: 'Название Жұмбақтас переводят как «загадочный камень»: с разных ракурсов силуэт воспринимается по-разному.',
  },
  {
    id: 'han-alany',
    dayId: '9',
    title: 'Абылай хан алаңы',
    place: 'Поляна Абылай-хана',
    time: '15:00',
    category: 'nature',
    x: 64,
    y: 33,
    imageIndex: 1,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/%D0%9E%D0%BA%D0%B6%D0%B5%D1%82%D0%BF%D0%B5%D1%81_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.jpg/1280px-%D0%9E%D0%BA%D0%B6%D0%B5%D1%82%D0%BF%D0%B5%D1%81_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Историко-природная остановка, где легенды об Абылай хане соединяются с рельефом Бурабая.',
    fact: 'На карте эта точка помогает связать городской памятник Абылай хану с бурбайской легендарной географией.',
  },
  {
    id: 'rakushka',
    dayId: '9',
    title: 'Жан асуы / Ракушка',
    place: 'Бурабай соқпағы',
    time: '16:00',
    category: 'nature',
    x: 58,
    y: 28,
    imageIndex: 1,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5_%D0%B8_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.JPG/1280px-%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5_%D0%B8_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE_%D0%91%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B5.JPG',
    imageCredit: 'Wikimedia Commons',
    description:
      'Финальная природная остановка дня: короткий переход, обзор ландшафта и спокойное завершение экскурсии.',
    fact: 'Название «Ракушка» помогает участникам запомнить точку как образ, а не только координату на тропе.',
  },
  {
    id: 'gabdullin-museum',
    dayId: '10',
    title: 'Мәлік Ғабдуллин музейі',
    place: 'Көкшетау',
    time: '09:00',
    category: 'heritage',
    x: 35,
    y: 50,
    imageIndex: 1,
    imageUrl: 'https://gabdullin-museum.kz/sites/gabdullin-museum.kz/uploads/photos/1.jpg',
    imageCredit: 'gabdullin-museum.kz',
    description:
      'Музейный блок первого потока: личность Мәлік Ғабдуллина, фронтовая история и культурная память региона.',
    fact: 'Мәлік Ғабдуллин был Героем Советского Союза, ученым-филологом и общественным деятелем.',
  },
  {
    id: 'literature-museum',
    dayId: '10',
    title: 'Әдебиет және өнер музейі',
    place: 'М. Әуезов көшесі, 163',
    time: '09:00',
    category: 'heritage',
    x: 31,
    y: 43,
    imageIndex: 1,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/037/30844f39.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Параллельная музейная точка: литература, искусство и имена, которые формируют культурный слой Ақмола өңірі.',
    fact: 'В программе группы меняются местами, поэтому две музейные точки показаны отдельно.',
  },
  {
    id: 'archive',
    dayId: '10',
    title: 'Ақмола облыстық мұрағаты',
    place: 'А. Баймұқанов көшесі, 23',
    time: '13:30',
    category: 'science',
    x: 18,
    y: 58,
    imageIndex: 1,
    imageUrl: 'https://e-history.kz/storage/tmp/resize/news/1200_0_74fb9c7f2e3fdfa5903b60df7bfada23.JPG',
    imageCredit: 'e-history.kz',
    description:
      'Работа с архивом и документами региона: хороший контраст к полевым экскурсиям и музейным экспозициям.',
    fact: 'Архивная точка делает маршрут исследовательским: участники учатся работать с источниками, а не только смотреть экспонаты.',
  },
  {
    id: 'university',
    dayId: '10',
    title: 'Ш. Уәлиханов атындағы университет',
    place: 'Абай көшесі, 76',
    time: '13:30',
    category: 'science',
    x: 20,
    y: 50,
    imageIndex: 1,
    imageUrl: 'https://shokan.edu.kz/media/images/21_917.original_3_bHhHJcl.original.format-webp.webp',
    imageCredit: 'shokan.edu.kz',
    description:
      'Научная часть: лаборатории, демонстрации и исследовательские задания для команд.',
    fact: 'В программе отмечены ЯМР-зертханасы и лаборатория качества воды - хороший мостик от экскурсии к исследованию.',
  },
  {
    id: 'city-museum',
    dayId: '11',
    title: 'Көкшетау қаласының тарихы музейі',
    place: 'Қанай би көшесі, 32',
    time: '09:30',
    category: 'heritage',
    x: 14,
    y: 60,
    imageIndex: 2,
    imageUrl: 'https://history-akmola.kz/upload/000/u1/037/30844f39.jpg',
    imageCredit: 'history-akmola.kz',
    description:
      'Городской музей открывает день индустрии и национального спорта: участники видят город как живую систему.',
    fact: 'Это самая западная городская точка маршрута внутри Көкшетау, поэтому раньше она была заметно смещена на карте.',
  },
  {
    id: 'mineral-water',
    dayId: '11',
    title: 'Көкшетау минералды сулары',
    place: '11-й проезд, 54/1',
    time: '13:30',
    category: 'industry',
    x: 74,
    y: 24,
    imageIndex: 2,
    imageUrl: 'https://kmw.kz/images/KMW1.png',
    imageCredit: 'kmw.kz',
    description:
      'Производственная экскурсия с понятной прикладной темой: вода, линия розлива, упаковка и контроль качества.',
    fact: 'Точка вынесена в промышленную часть города, поэтому прежняя координата была слишком далеко от реального адреса.',
  },
  {
    id: 'tynys',
    dayId: '11',
    title: '«Тыныс» АҚ',
    place: 'Ы. Алтынсарин көшесі, 13',
    time: '13:30',
    category: 'industry',
    x: 72,
    y: 51,
    imageIndex: 2,
    imageUrl: 'https://tynys.kz/wp-content/uploads/2025/05/img_3676-e1754977388740.jpg',
    imageCredit: 'tynys.kz',
    description:
      'Индустриальный блок о предприятии, производстве и инженерных профессиях.',
    fact: 'Здесь хорошо работает связка «наука - производство - профессия», особенно после университетской лабораторной части.',
  },
  {
    id: 'sport-school',
    dayId: '11',
    title: 'Ұлттық спорт мектебі',
    place: 'Красный Яр, Ә. Ұмышев көшесі, 2Б',
    time: '15:30',
    category: 'action',
    x: 6,
    y: 20,
    imageIndex: 2,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/08/Kokpar%2C_Central_asian_national_game.jpg',
    imageCredit: 'Wikimedia Commons',
    description:
      'Практическая часть дня: национальные виды спорта и встреча с местными ребятами в Красном Яре.',
    fact: 'Координата перенесена к адресу школы в Красном Яре, а не оставлена приблизительно на окраине.',
  },
  {
    id: 'closing',
    dayId: '12',
    title: 'НИШ Көкшетау: Chocolate ART и закрытие',
    place: 'Ж. Тлеулина, 59',
    time: '09:00-15:30',
    category: 'action',
    x: 36,
    y: 27,
    imageIndex: 2,
    imageUrl: 'https://schools.nis.edu.kz/storage/school/525473554_IMG_2496.jpg',
    imageCredit: 'НИШ Кокшетау',
    pinShift: { x: 0, y: -18 },
    description:
      'Chocolate ART, спортивная эстафета, рисунки, рефлексия и торжественное закрытие прошли в НИШ Көкшетау.',
    fact: 'Эта точка специально исправлена по вашему уточнению: финал и Chocolate ART не вынесены в город, а стоят на школьной координате.',
  },
  {
    id: 'departure',
    dayId: '13',
    title: 'Шығарып салу',
    place: 'НИШ Көкшетау, Ж. Тлеулина, 59',
    time: '13:00',
    category: 'action',
    x: 36,
    y: 27,
    imageIndex: 2,
    imageUrl: 'https://schools.nis.edu.kz/storage/school/752670444_IMG_0553.JPG',
    imageCredit: 'НИШ Кокшетау',
    pinShift: { x: 18, y: -4 },
    description:
      'Заключительная точка маршрута: отправление участников и завершение экспедиции со школьной базы.',
    fact: 'Теперь отъезд также привязан к НИШ, а не к условной точке в центре Көкшетау.',
  },
];

const pointCoordinates = {
  'nis-opening': { lat: 53.2934092, lng: 69.3887026 },
  'birzhan-sal': { lat: 53.2804346, lng: 69.381167 },
  'akan-seri': { lat: 53.2806483, lng: 69.3834674 },
  'eternal-flame': { lat: 53.2801847, lng: 69.3789151 },
  shokan: { lat: 53.2835672, lng: 69.3705536 },
  abylai: { lat: 53.2853594, lng: 69.3806908 },
  begeldinov: { lat: 53.2843715, lng: 69.377726 },
  'mother-stela': { lat: 53.2879368, lng: 69.4214155 },
  theatre: { lat: 53.28661, lng: 69.3789223 },
  'burabay-road': { lat: 53.0787586, lng: 70.3063034 },
  maral: { lat: 53.12773, lng: 70.412764 },
  'visit-center': { lat: 53.0787586, lng: 70.3063034 },
  jumbaktas: { lat: 53.0874971, lng: 70.2519321 },
  'han-alany': { lat: 53.08371, lng: 70.2349246 },
  rakushka: { lat: 53.0499117, lng: 70.1957854 },
  'gabdullin-museum': { lat: 53.2839386, lng: 69.3882403 },
  'literature-museum': { lat: 53.2874473, lng: 69.3796603 },
  archive: { lat: 53.2804857, lng: 69.3637181 },
  university: { lat: 53.2832347, lng: 69.3706063 },
  'city-museum': { lat: 53.2820862, lng: 69.3605753 },
  'mineral-water': { lat: 53.310114, lng: 69.415581 },
  tynys: { lat: 53.284188, lng: 69.4107367 },
  'sport-school': { lat: 53.321641, lng: 69.253798 },
  closing: { lat: 53.2934092, lng: 69.3887026 },
  departure: { lat: 53.2934092, lng: 69.3887026 },
};

function getCategory(id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

function getDay(id) {
  return days.find((day) => day.id === id) ?? days[0];
}

function getPointImageSource(point) {
  if (point.imageUrl) {
    return { uri: point.imageUrl };
  }

  return programImages[point.imageIndex ?? 0]?.source ?? programImages[0].source;
}

function getMapPoint(point, index) {
  const coordinates = pointCoordinates[point.id] ?? pointCoordinates.departure;
  const category = getCategory(point.category);
  const day = getDay(point.dayId);

  return {
    id: point.id,
    index: index + 1,
    title: point.title,
    place: point.place,
    time: point.time,
    day: day.date,
    category: category.label,
    color: category.color,
    lat: coordinates.lat,
    lng: coordinates.lng,
    imageUrl: point.imageUrl,
    imageCredit: point.imageCredit,
    description: point.description,
    fact: point.fact,
    shiftX: point.pinShift?.x ?? 0,
    shiftY: point.pinShift?.y ?? 0,
  };
}

function createRouteMapHtml(points, selectedPointId) {
  const payload = JSON.stringify({
    selectedPointId,
    center: [53.18, 69.82],
    points: points.map(getMapPoint),
  }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map {
      height: 100%;
      margin: 0;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #d9f4ef;
    }

    #map {
      position: relative;
    }

    .leaflet-tile-pane {
      filter: saturate(1.2) contrast(0.96) hue-rotate(-6deg);
    }

    .map-search {
      align-items: center;
      background: rgba(250, 253, 248, 0.96);
      border: 1px solid rgba(22, 101, 52, 0.2);
      border-radius: 8px;
      box-shadow: 0 16px 38px rgba(20, 83, 45, 0.2);
      color: #143224;
      display: flex;
      gap: 10px;
      left: 12px;
      max-width: calc(100% - 104px);
      min-height: 44px;
      padding: 9px 12px;
      position: absolute;
      top: 12px;
      z-index: 900;
    }

    .map-search strong {
      display: block;
      font-size: 14px;
      line-height: 17px;
      font-weight: 900;
    }

    .map-search small {
      color: #475569;
      display: block;
      font-size: 11px;
      line-height: 14px;
      font-weight: 700;
    }

    .search-dot {
      background: #0f766e;
      border-radius: 50%;
      box-shadow: 0 0 0 5px rgba(15, 118, 110, 0.14);
      height: 12px;
      width: 12px;
    }

    .map-counter {
      background: rgba(20, 83, 45, 0.9);
      border-radius: 8px;
      bottom: 13px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 900;
      left: 12px;
      padding: 8px 10px;
      position: absolute;
      z-index: 900;
    }

    .route-pin-wrap {
      transform: translate(var(--dx), var(--dy));
    }

    .route-pin {
      align-items: center;
      background: var(--pin);
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 12px 25px rgba(20, 83, 45, 0.28);
      color: #ffffff;
      display: flex;
      font-size: 12px;
      font-weight: 900;
      height: 34px;
      justify-content: center;
      position: relative;
      width: 34px;
    }

    .route-pin::after {
      background: var(--pin);
      border-bottom: 3px solid #ffffff;
      border-right: 3px solid #ffffff;
      bottom: -8px;
      content: "";
      height: 12px;
      left: 8px;
      position: absolute;
      transform: rotate(45deg);
      width: 12px;
      z-index: -1;
    }

    .route-pin.selected {
      height: 42px;
      width: 42px;
    }

    .route-pin.selected span {
      font-size: 14px;
    }

    .route-popup {
      min-width: 230px;
      max-width: 255px;
    }

    .route-popup img {
      background: linear-gradient(135deg, #eef7e8, #d9f4ef);
      border-radius: 8px;
      display: block;
      height: 118px;
      margin-bottom: 9px;
      object-fit: contain;
      width: 100%;
    }

    .route-popup b {
      color: #143224;
      display: block;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 5px;
    }

    .route-popup span {
      color: #475569;
      display: block;
      font-size: 12px;
      font-weight: 700;
      line-height: 17px;
    }

    .route-popup p {
      color: #334155;
      font-size: 12px;
      font-weight: 650;
      line-height: 17px;
      margin: 8px 0 0;
    }

    .route-popup em {
      background: #ecfdf5;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #14532d;
      display: block;
      font-size: 11px;
      font-style: normal;
      font-weight: 800;
      line-height: 15px;
      margin-top: 8px;
      padding: 7px 8px;
    }

    .popup-credit {
      color: #64748b !important;
      font-size: 10px !important;
      margin-top: 5px;
    }

    .leaflet-control-zoom {
      border: 0 !important;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
    }

    .leaflet-control-zoom a {
      border: 0 !important;
      color: #0f172a !important;
      font-weight: 900;
    }

    .leaflet-control-attribution {
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="map-search">
    <span class="search-dot"></span>
    <div>
      <strong>Карта TET-2026</strong>
      <small>Көкшетау · Бурабай · НИШ</small>
    </div>
  </div>
  <div class="map-counter" id="mapCounter">Карта загружается...</div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const data = ${payload};
    const map = L.map('map', {
      attributionControl: false,
      scrollWheelZoom: true,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft' })
      .addAttribution('&copy; OpenStreetMap contributors')
      .addTo(map);

    const bounds = [];
    const markers = new Map();

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function send(payload) {
      const message = JSON.stringify(payload);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(message);
      }
      if (window.parent) {
        window.parent.postMessage(message, '*');
      }
    }

    function markerIcon(point, selected) {
      return L.divIcon({
        className: '',
        html:
          '<div class="route-pin-wrap" style="--dx:' + point.shiftX + 'px;--dy:' + point.shiftY + 'px">' +
            '<div class="route-pin ' + (selected ? 'selected' : '') + '" style="--pin:' + point.color + '">' +
              '<span>' + point.index + '</span>' +
            '</div>' +
          '</div>',
        iconSize: selected ? [42, 50] : [34, 42],
        iconAnchor: selected ? [21, 46] : [17, 39],
        popupAnchor: [0, -38]
      });
    }

    function selectMarker(id, openPopup) {
      data.points.forEach((point) => {
        const marker = markers.get(point.id);
        if (!marker) {
          return;
        }
        marker.setIcon(markerIcon(point, point.id === id));
      });

      const selected = data.points.find((point) => point.id === id);
      if (selected) {
        map.panTo([selected.lat, selected.lng], { animate: true, duration: 0.45 });
        if (openPopup) {
          markers.get(id)?.openPopup();
        }
      }
    }

    if (data.points.length > 1) {
      const route = data.points.map((point) => [point.lat, point.lng]);
      L.polyline(route, {
        color: '#f8fff9',
        weight: 9,
        opacity: 0.9
      }).addTo(map);
      L.polyline(route, {
        color: '#0f766e',
        dashArray: '12 9',
        lineCap: 'round',
        weight: 4,
        opacity: 0.95
      }).addTo(map);
    }

    data.points.forEach((point) => {
      const selected = point.id === data.selectedPointId;
      const marker = L.marker([point.lat, point.lng], {
        icon: markerIcon(point, selected),
        keyboard: true,
        title: point.title
      }).addTo(map);

      marker.bindPopup(
        '<div class="route-popup">' +
          (point.imageUrl ? '<img src="' + escapeHtml(point.imageUrl) + '" alt="' + escapeHtml(point.title) + '">' : '') +
          '<b>' + escapeHtml(point.title) + '</b>' +
          '<span>' + escapeHtml(point.day) + ' · ' + escapeHtml(point.time) + '</span>' +
          '<span>' + escapeHtml(point.place) + '</span>' +
          '<span>' + escapeHtml(point.category) + '</span>' +
          '<p>' + escapeHtml(point.description) + '</p>' +
          '<em>' + escapeHtml(point.fact) + '</em>' +
          (point.imageCredit ? '<span class="popup-credit">Фото: ' + escapeHtml(point.imageCredit) + '</span>' : '') +
        '</div>'
      );

      marker.on('click', () => {
        selectMarker(point.id, true);
        send({ type: 'select-point', id: point.id });
      });

      markers.set(point.id, marker);
      bounds.push([point.lat, point.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [44, 44], maxZoom: 12 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    } else {
      map.setView(data.center, 8);
    }

    if (data.selectedPointId) {
      window.setTimeout(() => selectMarker(data.selectedPointId, false), 350);
    }

    document.getElementById('mapCounter').textContent =
      data.points.length + ' точек · слой маршрута';
  </script>
</body>
</html>`;
}

function getFirstVisiblePoint(dayId, categoryId) {
  return findVisiblePoint(dayId, categoryId) ?? routePoints[0];
}

function findVisiblePoint(dayId, categoryId) {
  return routePoints.find((point) => {
    const dayMatches = dayId === 'all' || point.dayId === dayId;
    const categoryMatches = categoryId === 'all' || point.category === categoryId;
    return dayMatches && categoryMatches;
  });
}

function CategoryChip({ category, active, onPress }) {
  const Icon = category.Icon;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryChip,
        active && { backgroundColor: category.color, borderColor: category.color },
        pressed && styles.pressed,
      ]}
    >
      <Icon size={16} color={active ? '#ffffff' : category.color} strokeWidth={2.2} />
      <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
        {category.label}
      </Text>
    </Pressable>
  );
}

function DayTab({ day, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayTab,
        active && { backgroundColor: day.accent, borderColor: day.accent },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.dayDate, active && styles.dayDateActive]}>{day.date}</Text>
      <Text style={[styles.dayShort, active && styles.dayShortActive]}>{day.short}</Text>
    </Pressable>
  );
}

function LeafletRouteMap({ visiblePoints, selectedPoint, onSelectPoint }) {
  const mapHtml = useMemo(
    () => createRouteMapHtml(visiblePoints, selectedPoint.id),
    [selectedPoint.id, visiblePoints]
  );

  function handleMapPayload(payload) {
    if (payload?.type === 'select-point' && payload.id) {
      onSelectPoint(payload.id);
    }
  }

  function handleNativeMessage(event) {
    try {
      handleMapPayload(JSON.parse(event.nativeEvent.data));
    } catch {
      // Ignore non-route messages from the embedded map.
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    function handleWindowMessage(event) {
      try {
        const payload =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        handleMapPayload(payload);
      } catch {
        // Other pages may post messages too; only route JSON matters here.
      }
    }

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [onSelectPoint]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.liveMapFrame}>
        {React.createElement('iframe', {
          title: 'TET-2026 OpenStreetMap route',
          srcDoc: mapHtml,
          sandbox: 'allow-scripts allow-same-origin allow-popups',
          style: {
            background: '#dbeafe',
            border: '0',
            display: 'block',
            height: '100%',
            width: '100%',
          },
        })}
      </View>
    );
  }

  return (
    <View style={styles.liveMapFrame}>
      <NativeWebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={handleNativeMessage}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        style={styles.webView}
      />
    </View>
  );
}

function DecorativeMap({ visiblePoints, selectedPoint, onSelectPoint }) {
  return (
    <View style={styles.mapStage}>
      <Svg width="100%" height="100%" viewBox="0 0 360 260" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="sky" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#b8e3ff" />
            <Stop offset="0.46" stopColor="#e7f8ff" />
            <Stop offset="1" stopColor="#fef9c3" />
          </SvgGradient>
          <SvgGradient id="lake" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#0284c7" />
            <Stop offset="1" stopColor="#06b6d4" />
          </SvgGradient>
          <SvgGradient id="land" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#bbf7d0" />
            <Stop offset="0.52" stopColor="#86efac" />
            <Stop offset="1" stopColor="#facc15" />
          </SvgGradient>
        </Defs>
        <Rect width="360" height="260" fill="url(#sky)" rx="28" />
        <Circle cx="306" cy="42" r="24" fill="#fff7ed" opacity="0.9" />
        <Path
          d="M0 112 C42 84 76 86 111 104 C153 126 183 79 227 93 C267 106 290 85 360 104 L360 260 L0 260 Z"
          fill="url(#land)"
        />
        <Path
          d="M0 190 C55 174 81 187 122 172 C160 158 190 163 230 174 C278 188 316 168 360 182 L360 260 L0 260 Z"
          fill="url(#lake)"
          opacity="0.95"
        />
        <Path d="M65 126 L102 66 L137 126 Z" fill="#1d4ed8" opacity="0.75" />
        <Path d="M94 126 L154 46 L206 126 Z" fill="#2563eb" opacity="0.7" />
        <Path d="M142 126 L205 70 L255 126 Z" fill="#0f766e" opacity="0.58" />
        <Path d="M102 66 L114 91 L95 82 Z" fill="#f8fafc" />
        <Path d="M154 46 L172 84 L144 76 Z" fill="#f8fafc" />
        <Path d="M205 70 L215 94 L194 88 Z" fill="#f8fafc" />
        <Path
          d="M42 196 C72 174 84 137 119 130 C153 123 172 146 196 128 C225 106 251 90 287 94 C317 97 332 123 338 152"
          fill="none"
          stroke="#7f1d1d"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1 11"
          opacity="0.72"
        />
        <Path
          d="M40 198 C91 178 114 153 145 145 C185 135 214 108 255 107 C291 107 319 126 338 154"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 9"
          opacity="0.95"
        />
        <Ellipse cx="82" cy="211" rx="48" ry="12" fill="#e0f2fe" opacity="0.45" />
        <Ellipse cx="262" cy="204" rx="64" ry="14" fill="#e0f2fe" opacity="0.38" />
        <Path d="M16 154 L28 131 L40 154 Z" fill="#166534" />
        <Path d="M27 166 L40 140 L53 166 Z" fill="#15803d" />
        <Path d="M300 165 L314 138 L328 165 Z" fill="#166534" />
        <Path d="M314 174 L331 143 L348 174 Z" fill="#15803d" />
      </Svg>

      <View style={styles.mapLabel}>
        <Route size={15} color="#0f766e" />
        <Text style={styles.mapLabelText}>Маршрут TET-2026</Text>
      </View>

      {visiblePoints.map((point, index) => {
        const category = getCategory(point.category);
        const Icon = category.Icon;
        const selected = point.id === selectedPoint.id;

        return (
          <Pressable
            key={point.id}
            onPress={() => onSelectPoint(point.id)}
            style={({ pressed }) => [
              styles.pin,
              {
                left: `${point.x}%`,
                top: `${point.y}%`,
                backgroundColor: selected ? category.color : '#ffffff',
                borderColor: category.color,
                zIndex: selected ? 8 : 4 + index,
              },
              selected && styles.pinActive,
              pressed && styles.pinPressed,
            ]}
          >
            <Icon size={16} color={selected ? '#ffffff' : category.color} strokeWidth={2.4} />
          </Pressable>
        );
      })}
    </View>
  );
}

function KokshetauScene() {
  return (
    <View pointerEvents="none" style={styles.headerScene}>
      <Svg width="100%" height="100%" viewBox="0 0 420 190" preserveAspectRatio="none">
        <Defs>
          <SvgGradient id="headerLake" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#67e8f9" stopOpacity="0.72" />
            <Stop offset="1" stopColor="#0f766e" stopOpacity="0.54" />
          </SvgGradient>
          <SvgGradient id="headerHill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#6aa84f" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#14532d" stopOpacity="0.26" />
          </SvgGradient>
        </Defs>
        <Path
          d="M-18 119 C40 84 85 91 133 66 C188 37 234 58 282 34 C333 8 386 26 438 0 L438 190 L-18 190 Z"
          fill="url(#headerHill)"
        />
        <Path
          d="M-20 142 C61 128 108 154 176 137 C251 118 307 138 440 115 L440 190 L-20 190 Z"
          fill="url(#headerLake)"
        />
        <Path
          d="M28 130 l14 -38 l14 38 h-8 l11 27 h-34 l11 -27 Z"
          fill="#166534"
          opacity="0.58"
        />
        <Path
          d="M333 113 l18 -48 l18 48 h-10 l14 35 h-44 l14 -35 Z"
          fill="#0f5132"
          opacity="0.48"
        />
        <Path
          d="M378 125 l12 -32 l12 32 h-7 l9 24 h-29 l9 -24 Z"
          fill="#166534"
          opacity="0.52"
        />
        <Circle cx="300" cy="40" r="18" fill="#facc15" opacity="0.45" />
      </Svg>
    </View>
  );
}

function SelectedPointCard({ point }) {
  const category = getCategory(point.category);
  const day = getDay(point.dayId);
  const Icon = category.Icon;
  const coordinates = pointCoordinates[point.id];
  const coordinateLabel = coordinates
    ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
    : 'Координаты уточняются';

  return (
    <View style={styles.selectedCard}>
      <View style={styles.selectedContent}>
        <View style={styles.selectedImageFrame}>
          <Image
            source={getPointImageSource(point)}
            style={styles.selectedImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.selectedBody}>
          <View style={styles.selectedTop}>
            <View style={[styles.selectedIcon, { backgroundColor: category.color }]}>
              <Icon size={20} color="#ffffff" strokeWidth={2.4} />
            </View>
            <View style={styles.selectedTitleBlock}>
              <Text style={styles.selectedKicker}>
                {day.date} · {point.time}
              </Text>
              <Text style={styles.selectedTitle}>{point.title}</Text>
              <Text style={styles.selectedPlace}>{point.place}</Text>
              <Text style={styles.selectedCoordinates}>{coordinateLabel}</Text>
            </View>
          </View>

          <Text style={styles.selectedDescription}>{point.description}</Text>

          <View style={styles.factRow}>
            <Sparkles size={18} color="#b45309" strokeWidth={2.2} />
            <Text style={styles.factText}>{point.fact}</Text>
          </View>
          {point.imageCredit && <Text style={styles.photoCredit}>Фото: {point.imageCredit}</Text>}
        </View>
      </View>
    </View>
  );
}

function TimelineDay({ day, points, selectedPointId, onSelectPoint }) {
  if (day.id === 'all') {
    return null;
  }

  return (
    <View style={styles.timelineDay}>
      <View style={[styles.timelineAccent, { backgroundColor: day.accent }]} />
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <View>
            <Text style={styles.timelineDate}>{day.date}</Text>
            <Text style={styles.timelineTitle}>{day.title}</Text>
          </View>
          <Text style={styles.timelineCount}>{points.length} точек</Text>
        </View>
        <Text style={styles.timelineSummary}>{day.summary}</Text>

        {points.map((point) => {
          const category = getCategory(point.category);
          const Icon = category.Icon;
          const selected = point.id === selectedPointId;

          return (
            <Pressable
              key={point.id}
              onPress={() => onSelectPoint(point.id)}
              style={({ pressed }) => [
                styles.timelinePoint,
                selected && { borderColor: category.color, backgroundColor: '#fff7ed' },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.timelinePointIcon, { backgroundColor: category.color }]}>
                <Icon size={14} color="#ffffff" strokeWidth={2.4} />
              </View>
              <View style={styles.timelinePointText}>
                <Text style={styles.timelinePointTime}>{point.time}</Text>
                <Text style={styles.timelinePointTitle}>{point.title}</Text>
              </View>
              <ChevronRight size={17} color="#64748b" strokeWidth={2.2} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ProgramGallery({ onOpenImage }) {
  return (
    <View style={styles.galleryBand}>
      <View style={styles.sectionTitleRow}>
        <ImageIcon size={20} color="#0f766e" strokeWidth={2.2} />
        <Text style={styles.sectionTitle}>Материалы программы</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryList}
      >
        {programImages.map((image) => (
          <Pressable
            key={image.id}
            onPress={() => onOpenImage(image)}
            style={({ pressed }) => [styles.programCard, pressed && styles.pressed]}
          >
            <Image source={image.source} style={styles.programImage} resizeMode="contain" />
            <View style={styles.programMeta}>
              <Text style={styles.programTitle}>{image.title}</Text>
              <Text style={styles.programCaption}>{image.caption}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [activeDay, setActiveDay] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPointId, setSelectedPointId] = useState(routePoints[0].id);
  const [openImage, setOpenImage] = useState(null);

  const selectedPoint =
    routePoints.find((point) => point.id === selectedPointId) ?? routePoints[0];

  const visiblePoints = useMemo(
    () =>
      routePoints.filter((point) => {
        const dayMatches = activeDay === 'all' || point.dayId === activeDay;
        const categoryMatches = activeCategory === 'all' || point.category === activeCategory;
        return dayMatches && categoryMatches;
      }),
    [activeDay, activeCategory]
  );

  function updateDay(dayId) {
    const nextPoint = findVisiblePoint(dayId, activeCategory);
    setActiveDay(dayId);

    if (nextPoint) {
      setSelectedPointId(nextPoint.id);
      return;
    }

    setActiveCategory('all');
    setSelectedPointId(getFirstVisiblePoint(dayId, 'all').id);
  }

  function updateCategory(categoryId) {
    const nextPoint = findVisiblePoint(activeDay, categoryId);
    setActiveCategory(categoryId);

    if (nextPoint) {
      setSelectedPointId(nextPoint.id);
      return;
    }

    setActiveDay('all');
    setSelectedPointId(getFirstVisiblePoint('all', categoryId).id);
  }

  function selectPoint(pointId) {
    const point = routePoints.find((item) => item.id === pointId);
    if (!point) {
      return;
    }

    setSelectedPointId(pointId);
  }

  const pointsByDay = days.reduce((acc, day) => {
    acc[day.id] = routePoints.filter((point) => point.dayId === day.id);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" backgroundColor="#f4f7ed" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.page}
      >
        <LinearGradient
          colors={['#d8f3dc', '#e0f2fe', '#fef3c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <KokshetauScene />
          <View style={styles.headerTop}>
            <View style={styles.logoMark}>
              <Compass size={24} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.badgeText}>Интерактивная карта</Text>
              <Text style={styles.heroTitle}>Маршрут TET-2026</Text>
              <Text style={styles.heroSubtitle}>НИШ Көкшетау · город · Бурабай табиғаты</Text>
            </View>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <CalendarDays size={18} color="#0f766e" />
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>дней</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin size={18} color="#b45309" />
              <Text style={styles.statNumber}>{routePoints.length}</Text>
              <Text style={styles.statLabel}>точек</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={18} color="#2563eb" />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>тем</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.controlsBand}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabs}
          >
            {days.map((day) => (
              <DayTab
                key={day.id}
                day={day}
                active={activeDay === day.id}
                onPress={() => updateDay(day.id)}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                active={activeCategory === category.id}
                onPress={() => updateCategory(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.mapBand}>
          <View style={styles.sectionTitleRow}>
            <Search size={20} color="#0f766e" strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>Карта экспедиции</Text>
          </View>
          <LeafletRouteMap
            visiblePoints={visiblePoints}
            selectedPoint={selectedPoint}
            onSelectPoint={selectPoint}
          />
          <Text style={styles.mapCounter}>
            {visiblePoints.length} из {routePoints.length} точек маршрута
          </Text>
        </View>

        <SelectedPointCard point={selectedPoint} />

        <View style={styles.timelineBand}>
          <View style={styles.sectionTitleRow}>
            <Clock size={20} color="#0f766e" strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>Программа по дням</Text>
          </View>
          {days.map((day) => (
            <TimelineDay
              key={day.id}
              day={day}
              points={pointsByDay[day.id] ?? []}
              selectedPointId={selectedPoint.id}
              onSelectPoint={selectPoint}
            />
          ))}
        </View>

        <View style={styles.themeGrid}>
          <View style={styles.sectionTitleRow}>
            <BookOpen size={20} color="#0f766e" strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>Смысловые линии</Text>
          </View>
          <View style={styles.themeRows}>
            <View style={styles.themeTile}>
              <Landmark size={22} color="#b45309" />
              <Text style={styles.themeTitle}>Память</Text>
              <Text style={styles.themeText}>памятники, музеи, архивы</Text>
            </View>
            <View style={styles.themeTile}>
              <Waves size={22} color="#0284c7" />
              <Text style={styles.themeTitle}>Ландшафт</Text>
              <Text style={styles.themeText}>озера, лес, Бурабай</Text>
            </View>
            <View style={styles.themeTile}>
              <School size={22} color="#2563eb" />
              <Text style={styles.themeTitle}>Исследование</Text>
              <Text style={styles.themeText}>университет, лаборатории</Text>
            </View>
            <View style={styles.themeTile}>
              <Bus size={22} color="#be123c" />
              <Text style={styles.themeTitle}>Практика</Text>
              <Text style={styles.themeText}>производство и спорт</Text>
            </View>
          </View>
        </View>

        <ProgramGallery onOpenImage={setOpenImage} />
      </ScrollView>

      <Modal visible={Boolean(openImage)} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{openImage?.title}</Text>
                <Text style={styles.modalCaption}>{openImage?.caption}</Text>
              </View>
              <Pressable
                onPress={() => setOpenImage(null)}
                style={({ pressed }) => [styles.modalClose, pressed && styles.pressed]}
              >
                <X size={22} color="#0f172a" strokeWidth={2.4} />
              </Pressable>
            </View>
            {openImage && (
              <Image source={openImage.source} style={styles.modalImage} resizeMode="contain" />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7ed',
  },
  page: {
    paddingBottom: 34,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 30 : 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  headerScene: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 1,
  },
  logoMark: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14532d',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.72)',
  },
  headerCopy: {
    flex: 1,
  },
  badgeText: {
    fontSize: 13,
    color: '#14532d',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: isCompact ? 30 : 34,
    lineHeight: isCompact ? 34 : 38,
    color: '#0f172a',
    fontWeight: '900',
  },
  heroSubtitle: {
    marginTop: 5,
    fontSize: 16,
    lineHeight: 21,
    color: '#24422f',
    fontWeight: '700',
  },
  headerStats: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    minHeight: 78,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  statNumber: {
    marginTop: 7,
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  controlsBand: {
    paddingTop: 16,
  },
  dayTabs: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayTab: {
    width: 106,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#c7e6b3',
  },
  dayDate: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '800',
  },
  dayShort: {
    marginTop: 4,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '900',
  },
  dayDateActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  dayShortActive: {
    color: '#ffffff',
  },
  categoryTabs: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 2,
    gap: 8,
  },
  categoryChip: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#c7e6b3',
  },
  categoryText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '800',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  mapBand: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
  },
  mapStage: {
    width: '100%',
    aspectRatio: 1.33,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#bfdbd2',
    borderWidth: 1,
    borderColor: '#86c7aa',
  },
  mapLabel: {
    position: 'absolute',
    left: 14,
    top: 14,
    minHeight: 34,
    maxWidth: '74%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.86)',
  },
  mapLabelText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 13,
  },
  pin: {
    position: 'absolute',
    width: 38,
    height: 38,
    marginLeft: -19,
    marginTop: -19,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#0f172a',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pinActive: {
    width: 46,
    height: 46,
    marginLeft: -23,
    marginTop: -23,
    borderRadius: 23,
    borderColor: '#ffffff',
  },
  pinPressed: {
    transform: [{ scale: 0.96 }],
  },
  mapCounter: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  liveMapFrame: {
    width: '100%',
    height: isDesktop ? 520 : isCompact ? 340 : 390,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#d9f4ef',
    borderWidth: 1,
    borderColor: '#86c7aa',
  },
  webView: {
    flex: 1,
    backgroundColor: '#d9f4ef',
  },
  selectedCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#d6e9bd',
    shadowColor: '#14532d',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  selectedContent: {
    gap: 14,
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: isDesktop ? 'stretch' : 'center',
  },
  selectedImageFrame: {
    width: isDesktop ? 320 : '100%',
    height: isDesktop ? 230 : isCompact ? 176 : 202,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#edf7e8',
    borderWidth: 1,
    borderColor: '#d6e9bd',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  selectedBody: {
    flex: 1,
    alignSelf: 'stretch',
  },
  selectedTop: {
    flexDirection: 'row',
    gap: 12,
  },
  selectedIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTitleBlock: {
    flex: 1,
  },
  selectedKicker: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  selectedTitle: {
    marginTop: 4,
    color: '#0f172a',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },
  selectedPlace: {
    marginTop: 4,
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '800',
  },
  selectedCoordinates: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
  },
  selectedDescription: {
    marginTop: 13,
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  factRow: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  factText: {
    flex: 1,
    color: '#713f12',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  photoCredit: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineBand: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  timelineDay: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineAccent: {
    width: 5,
    borderRadius: 4,
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
    padding: 13,
    borderRadius: 8,
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#d6e9bd',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  timelineDate: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  timelineTitle: {
    marginTop: 3,
    color: '#0f172a',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },
  timelineCount: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    color: '#0f766e',
    backgroundColor: '#d9f99d',
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '900',
  },
  timelineSummary: {
    marginTop: 8,
    marginBottom: 10,
    color: '#4b5d46',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  timelinePoint: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6e9bd',
    marginTop: 7,
    backgroundColor: '#f7fbef',
  },
  timelinePointIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelinePointText: {
    flex: 1,
  },
  timelinePointTime: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '900',
  },
  timelinePointTitle: {
    marginTop: 2,
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  themeGrid: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  themeRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeTile: {
    width: '48%',
    minHeight: 120,
    padding: 13,
    borderRadius: 8,
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#d6e9bd',
  },
  themeTitle: {
    marginTop: 10,
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  themeText: {
    marginTop: 5,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  galleryBand: {
    paddingTop: 24,
  },
  galleryList: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  programCard: {
    width: isCompact ? 210 : 228,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fffef7',
    borderWidth: 1,
    borderColor: '#d6e9bd',
  },
  programImage: {
    width: '100%',
    height: isCompact ? 285 : 318,
    backgroundColor: '#f7fbef',
  },
  programMeta: {
    padding: 12,
  },
  programTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  programCaption: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
  },
  modalSheet: {
    flex: 1,
    maxHeight: '94%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fffef7',
  },
  modalHeader: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  modalCaption: {
    marginTop: 3,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  modalClose: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#edf7e8',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0f172a',
  },
  pressed: {
    opacity: 0.82,
  },
});
