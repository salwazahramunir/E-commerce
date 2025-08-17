import React from "react";
import Navbar from "../_components/navbar";
import SearchBar from "./_components/search-bar";
import FilterPrice from "./_components/filter-price";
import FilterStock from "./_components/filter-stock";
import FilterBrand from "./_components/filter-brand";
import FilterLocation from "./_components/filter-location";
import FilterCategory from "./_components/filter-category";
import ProductList from "./_components/product-list";

export default function CatalogPage() {
  return (
    <>
      <header className="bg-[#EFF3FA] pt-[30px] h-[351px] -mb-[181px]">
        <Navbar />
      </header>
      <SearchBar />
      <div
        id="catalog"
        className="container max-w-[1130px] mx-auto flex gap-[30px] mt-[50px] pb-[100px]"
      >
        <form
          action=""
          className="flex flex-1 flex-col bg-white p-[30px] gap-5 h-fit border border-[#E5E5E5] rounded-[30px]"
        >
          <h2 className="font-bold text-2xl leading-[34px]">Filters</h2>
          <FilterPrice />

          <hr className="border-[#E5E5E5]" />
          <FilterStock />

          <hr className="border-[#E5E5E5]" />
          <FilterBrand />

          <hr className="border-[#E5E5E5]" />
          <FilterLocation />

          <hr className="border-[#E5E5E5]" />
          <FilterCategory />
        </form>

        <div className="w-[780px] flex flex-col bg-white p-[30px] gap-[30px] h-fit border border-[#E5E5E5] rounded-[30px]">
          <h2 className="font-bold text-2xl leading-[34px]">Products</h2>
          <ProductList />
        </div>
      </div>
    </>
  );
}
