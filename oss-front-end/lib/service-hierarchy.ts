export type ServiceNode = {
  id: string;
  title: { [key: string]: string }; // Localized titles
  type: "wirtuu" | "damee" | "sub-damee" | "service";
  children?: ServiceNode[];
  link?: string;
};

export const serviceHierarchy: ServiceNode[] = [
  {
    id: "w-1",
    title: {
      en: "Investment Commission",
      om: "Koomishinii Investimatii",
      am: "የኢንቨስትመንት ኮሚሽን",
    },
    type: "wirtuu",
    children: [
      {
        id: "d-1",
        title: {
          en: "Licensing Directorate",
          om: "Daayirektoreetii Hayyamaa",
          am: "የፈቃድ ዳይሬክቶሬት",
        },
        type: "damee",
        children: [
          {
            id: "s-1",
            title: {
              en: "New Investment Permit",
              om: "Hayyama Investimatii Haaraa",
              am: "አዲስ የኢንቨስትመንት ፈቃድ",
            },
            type: "service",
            link: "/services/investment-permit",
          },
          {
            id: "s-2",
            title: {
              en: "Permit Renewal",
              om: "Haaromsa Hayyamaa",
              am: "የፈቃድ እድሳት",
            },
            type: "service",
            link: "/services/investment/renewal",
          },
        ],
      },
    ],
  },
  {
    id: "w-2",
    title: { en: "Agriculture Bureau", om: "Biiroo Qonnaa", am: "ግብርና ቢሮ" },
    type: "wirtuu",
    children: [
      {
        id: "d-2",
        title: {
          en: "Land Management",
          om: "Bulchiinsa Lafa",
          am: "መሬት አስተዳደር",
        },
        type: "damee",
        children: [], // Placeholder
      },
    ],
  },
];
