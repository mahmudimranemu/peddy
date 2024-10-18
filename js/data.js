window.addEventListener("load", (event) => {
  const apiBaseURL = "https://openapi.programming-hero.com/api/peddy/";

  const loadCategories = () => {
    fetch(apiBaseURL + "categories")
      .then((res) => res.json())
      .then((data) => displayCategories(data.categories))
      .catch((err) => console.log(err));
  };

  const removeClass = () => {
    const categoryBtns = document.getElementsByClassName("category-btn");
    for (let btn of categoryBtns) {
      btn.classList.remove(
        "border-brandColor",
        "rounded-full",
        "bg-brandColor/10"
      );
    }
  };

  const loadCategoryPets = (category) => {
    fetch(`${apiBaseURL}category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        const activeCategoryBtn = document.getElementById(`btn-${category}`);
        removeClass();

        activeCategoryBtn.classList.add(
          "border-brandColor",
          "rounded-full",
          "bg-brandColor/10"
        );
        console.log("clicked");
        if (data.data && data.data.length > 0) {
          displayPets(data.data);
        } else {
          const petsList = document.getElementById("pet-list");
          petsList.innerHTML = "";
          petsList.classList.add(
            "flex-col",
            "gap-6",
            "w-full",
            "justify-center"
          );
          petsList.innerHTML = `
          
            <img src="./img/empty.svg" alt="No Information Available" />
            <h2 class="text-center font-black text-4xl">No Information Available</h2>
            <p class="text-center">No pets found for this category. Please try another category.</p>
        
          `;
        }
      })
      .catch((err) => console.log(err));
  };

  const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");

    categories.forEach((item) => {
      console.log(item);
      const btnContainer = document.createElement("div");
      btnContainer.innerHTML = `
      <button id="btn-${item.category}" class="category-btn flex items-center gap-2 justify-center font-black text-2xl p-6 w-[312px] rounded-2xl border border-brandColor/10 hover:border-brandColor hover:rounded-full hover:bg-brandColor/10">
      <img src="${item.category_icon}" class="w-10">
      ${item.category}
      </button>
      `;
      btnContainer
        .querySelector(`#btn-${item.category}`)
        .addEventListener("click", () => loadCategoryPets(item.category));

      categoryContainer.appendChild(btnContainer);
    });
  };

  const loadAllPets = () => {
    fetch(apiBaseURL + "pets")
      .then((res) => res.json())
      .then((data) => displayPets(data.pets))
      .catch((err) => console.log(err));
  };

  const displayPets = (pets) => {
    const petsList = document.getElementById("pet-list");
    petsList.innerHTML = "";
    if (Array.isArray(pets)) {
      pets.forEach((pet) => {
        petsList.classList.remove("flex-col", "w-full", "justify-center");
        const petContainer = document.createElement("div");
        petContainer.innerHTML = `
        <div class="border border-black/10 p-5 rounded-xl flex flex-col gap-6 w-[312px]">
          <img src="${pet.image}" alt="${
          pet.pet_name
        }" class="rounded-lg w-full">
          <div class="flex flex-col gap-5">
              <h1 class="font-black text-xl">${pet.pet_name}</h1>
              <ul class="flex flex-col gap-2">
                  <li class="flex gap-2 text-black/70"> <img src="./img/breed.svg"> Breed: ${
                    !pet.breed || pet.breed === "null"
                      ? "Not Available"
                      : pet.breed
                  } </li>
                  <li class="flex gap-2 text-black/70"> <img src="./img/date.svg"> Birth: ${
                    !pet.date_of_birth || pet.date_of_birth === "null"
                      ? "No Birth Date"
                      : pet.date_of_birth
                  } </li>
                  <li class="flex gap-2 text-black/70"> <img src="./img/gender.svg"> Gender: ${
                    !pet.gender || pet.gender === "null"
                      ? "Gender Not Mentioned"
                      : pet.gender
                  } </li>
                  <li class="flex gap-2 text-black/70"> <img src="./img/price.svg"> Price:${
                    !pet.price || pet.price === "null"
                      ? " Price Not Set"
                      : pet.price
                  } </li>
              </ul>
              <hr>
              <div class="flex gap-2">
                  <button id="btn-like-${
                    pet.petId
                  }" class="flex items-center py-2 px-4 border border-brandColor/10 rounded-lg">
                    ${likeIcon}
                  </button>
                  <button id="btn-adopt-${
                    pet.petId
                  }" class="flex py-2 px-5 border border-brandColor/10 rounded-lg text-brandColor font-black text-lg"> Adopt </button>
                  <button id="btn-details-${
                    pet.petId
                  }" class="flex py-2 px-5 border border-brandColor/10 rounded-lg text-brandColor font-black text-lg"> Details </button>
              </div>
          </div>
        
        </div>
        `;

        const btnLike = petContainer.querySelector(`#btn-like-${pet.petId}`);
        const btnAdopt = petContainer.querySelector(`#btn-adopt-${pet.petId}`);
        const btnDetails = petContainer.querySelector(
          `#btn-details-${pet.petId}`
        );

        btnLike.addEventListener("click", () => {
          btnLike.innerHTML = likeIconFill;
          const storePets = document.getElementById("liked-pets");
          storePets.innerHTML += `
          <img src="${pet.image}" alt="${pet.pet_name}" class="rounded-lg w-full">
          `;
        });

        btnAdopt.addEventListener("click", () => {
          const adopt = document.getElementById("my_modal_adopt");
          adopt.showModal();

          const showCountDown = document.createElement("p");
          showCountDown.classList.add("countdown", "font-black", "text-2xl");

          adopt.innerHTML = `
            <div class="modal-box flex flex-col gap-6 items-center">
              <h3 class="text-lg font-bold">
                <strong>${pet.pet_name}</strong> is now yours!
              </h3>
              <img src="${pet.image}" alt="${pet.pet_name}" class="rounded-lg w-full">
            </div>
            <form
              method="dialog"
              class="modal-backdrop">
              <button>close</button>
            </form>
          `;

          adopt.querySelector(".modal-box").appendChild(showCountDown);

          let countDown = 5;
          const countDownInterval = setInterval(() => {
            countDown--;
            showCountDown.textContent = countDown;

            if (countDown === 0) {
              clearInterval(countDownInterval);
              adopt.close();
              btnAdopt.classList.remove("text-brandColor");
              btnAdopt.classList.add("bg-brandColor", "text-white");
              btnAdopt.innerHTML = `Adopted`;
            }
          }, 1000);

          console.log(`Details ${pet.petId}`);
        });

        btnDetails.addEventListener("click", () => {
          const details = document.getElementById("my_modal_details");
          details.showModal();
          details.innerHTML = `
          <div class="modal-box w-11/12 max-w-2xl gap-6">
            <img src="${pet.image}" alt="${
            pet.pet_name
          }" class="rounded-lg w-full">
            <div class="flex flex-col gap-4 mt-6">
              <div class="flex flex-col gap-4">
                <h3 class="text-2xl font-black">${pet.pet_name}</h3>
                <div class="flex gap-6">
                  <ul class="flex flex-col gap-2">
                    <li class="flex gap-2 text-black/70">
                      <img src="./img/breed.svg" /> Breed: ${
                        !pet.breed || pet.breed === "null"
                          ? "Not Available"
                          : pet.breed
                      }
                    </li>
                    <li class="flex gap-2 text-black/70">
                      <img src="./img/gender.svg" /> Gender: ${
                        !pet.gender || pet.gender === "null"
                          ? "No Birth Date"
                          : pet.gender
                      }
                    </li>
                    <li class="flex gap-2 text-black/70">
                      <img src="./img/gender.svg" /> Vaccinated Status:
                      ${
                        !pet.vaccinated_status ||
                        pet.vaccinated_status === "null"
                          ? "Not Found"
                          : pet.vaccinated_status
                      }

                    </li>
                  </ul>
                  <ul class="flex flex-col gap-2">
                    <li class="flex gap-2 text-black/70">
                      <img src="./img/date.svg" /> Birth: ${
                        !pet.date_of_birth || pet.date_of_birth === "null"
                          ? "Gender Not Mentioned"
                          : pet.date_of_birth
                      }
                    </li>
                    <li class="flex gap-2 text-black/70">
                      <img src="./img/price.svg" /> Price:
                      ${
                        !pet.price || pet.price === "null"
                          ? " Price Not Set"
                          : pet.price
                      }
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <h2 class="font-bold">Details Information</h2>
                <p>
                  ${pet.pet_details}
                </p>
              </div>
              <div class="">
                <form method="dialog">
                  <button
                    class="bg-brandColor/10 text-brandColor border border-brandColor/20 font-bold text-lg px-8 py-4 rounded-xl w-full">
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
          `;
        });

        petsList.appendChild(petContainer);
      });
    }
  };

  loadAllPets();
  loadCategories();
});
