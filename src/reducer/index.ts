import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// COMMENT: Add TMenu in below import statement
import { TFooterData, THeaderData, THomePageData, TPdfData } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  pdfData: TPdfData | null;
  // COMMENT: Uncomment below line
  // menuPageData: TMenu[];
}

const initialState: AppState = {
  headerData: {
    website_title: "",
    logo: {
      url: "",
    },
    navigation_links: {
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
  },
  footerData: {
    title: "",
    navigation_links: {
      title: "",
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
    information_section: {
      logo: {
        url: "",
      },
      descrption: "",
      timings: "",
      holiday: "",
    },
    copyright: "",
  },
  homePageData: {
    sections: [
      {
        home: {
          hero_section: {
            banner: {
              url: "",
            },
            heading: "",
            description: "",
            primary_cta: "",
          },
        },
      },
    ],
  },
  pdfData: null,
  // COMMENT: Uncomment below lines
  // menuPageData: [
  //   {
  //     course_name: "",
  //     dishes: [
  //       {
  //         uid: "",
  //         image: {
  //           url: "",
  //         },
  //         title: "",
  //         description: "",
  //         price: 0,
  //       },
  //     ],
  //   },
  // ],
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setHeaderData: (state, action: PayloadAction<THeaderData>) => {
      state.headerData = action.payload;
    },
    setFooterData: (state, action: PayloadAction<TFooterData>) => {
      state.footerData = action.payload;
    },
    setHomePageData: (state, action: PayloadAction<THomePageData>) => {
      state.homePageData = action.payload;
    },
    setPdfData: (state, action: PayloadAction<TPdfData>) => {
      state.pdfData = action.payload;
    },
    // COMMENT: Uncomment below lines
    // setMenuPageData: (state, action: PayloadAction<TMenu[]>) => {
    //   state.menuPageData = action.payload;
    // },
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  setPdfData,
  // COMMENT: Uncomment below line
  // setMenuPageData,
} = mainSlice.actions;

export default mainSlice.reducer;
