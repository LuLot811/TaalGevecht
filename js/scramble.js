/**
 * Woordvolgorde: Engelse woorden schuiven naar de juiste plek
 */

const ScrambleUI = (() => {
  let state = null;
  let locked = false;
  let selectedChipId = null;
  let onSubmit = null;
  let bound = false;

  const els = {
    panel: null,
    slots: null,
    bank: null,
    submit: null,
  };

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function slotIndexForChip(chipId) {
    return state.slots.findIndex((id) => id === chipId);
  }

  function clearChipFromSlots(chipId) {
    const idx = slotIndexForChip(chipId);
    if (idx >= 0) {
      state.slots[idx] = null;
      selectedChipId = null;
      render();
    }
  }

  function placeChip(chipId, slotIndex) {
    const prevSlot = slotIndexForChip(chipId);
    if (prevSlot >= 0) state.slots[prevSlot] = null;

    const occupant = state.slots[slotIndex];
    if (occupant && occupant !== chipId) {
      if (prevSlot >= 0) state.slots[prevSlot] = occupant;
    }

    state.slots[slotIndex] = chipId;
    selectedChipId = null;
    render();
  }

  function allSlotsFilled() {
    return state.slots.every(Boolean);
  }

  function getAnswer() {
    if (!state) return "";
    return state.slots
      .map((id) => {
        const chip = state.chips.find((c) => c.id === id);
        return chip ? chip.word : "";
      })
      .join(" ");
  }

  function createChip(chip, source) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scramble-chip";
    btn.textContent = chip.word;
    btn.dataset.chipId = chip.id;
    btn.dataset.source = source;
    btn.draggable = !locked;

    if (selectedChipId === chip.id) {
      btn.classList.add("scramble-chip--selected");
    }

    btn.addEventListener("dragstart", (e) => {
      if (locked) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/chip-id", chip.id);
      e.dataTransfer.effectAllowed = "move";
      btn.classList.add("scramble-chip--dragging");
    });

    btn.addEventListener("dragend", () => {
      btn.classList.remove("scramble-chip--dragging");
    });

    return btn;
  }

  function render() {
    if (!state || !els.slots || !els.bank) return;

    els.slots.innerHTML = "";
    state.slots.forEach((chipId, index) => {
      const slot = document.createElement("div");
      slot.className = "scramble-slot" + (chipId ? " scramble-slot--filled" : "");
      slot.dataset.index = String(index);

      if (chipId) {
        const chip = state.chips.find((c) => c.id === chipId);
        if (chip) slot.appendChild(createChip(chip, "slot"));
      }

      els.slots.appendChild(slot);
    });

    els.bank.innerHTML = "";
    const used = new Set(state.slots.filter(Boolean));
    state.bankOrder
      .map((chipId) => state.chips.find((chip) => chip.id === chipId))
      .filter((chip) => chip && !used.has(chip.id))
      .forEach((chip) => {
        els.bank.appendChild(createChip(chip, "bank"));
      });

    els.submit.disabled = locked;
  }

  function bindEvents() {
    if (bound) return;
    bound = true;

    els.submit.addEventListener("click", () => {
      if (locked || !state || !onSubmit) return;
      if (!allSlotsFilled()) {
        els.panel.classList.add("scramble-panel--incomplete");
        setTimeout(() => els.panel.classList.remove("scramble-panel--incomplete"), 400);
        return;
      }
      onSubmit(getAnswer());
    });

    els.bank.addEventListener("dragover", (e) => e.preventDefault());
    els.bank.addEventListener("drop", (e) => {
      e.preventDefault();
      if (locked) return;
      const chipId = e.dataTransfer.getData("text/chip-id");
      if (chipId) clearChipFromSlots(chipId);
    });

    els.bank.addEventListener("click", (e) => {
      const chip = e.target.closest(".scramble-chip");
      if (!chip || locked || chip.dataset.source !== "bank") return;
      const id = chip.dataset.chipId;
      selectedChipId = selectedChipId === id ? null : id;
      render();
    });

    els.slots.addEventListener("dragover", (e) => {
      const slot = e.target.closest(".scramble-slot");
      if (slot && !locked) {
        e.preventDefault();
        slot.classList.add("scramble-slot--over");
      }
    });

    els.slots.addEventListener("dragleave", (e) => {
      const slot = e.target.closest(".scramble-slot");
      if (slot) slot.classList.remove("scramble-slot--over");
    });

    els.slots.addEventListener("drop", (e) => {
      const slot = e.target.closest(".scramble-slot");
      if (!slot || locked) return;
      e.preventDefault();
      slot.classList.remove("scramble-slot--over");
      const chipId = e.dataTransfer.getData("text/chip-id");
      if (chipId) placeChip(chipId, parseInt(slot.dataset.index, 10));
    });

    els.slots.addEventListener("click", (e) => {
      const slot = e.target.closest(".scramble-slot");
      if (!slot || locked) return;
      const index = parseInt(slot.dataset.index, 10);

      const chipBtn = e.target.closest(".scramble-chip");
      if (chipBtn && chipBtn.dataset.source === "slot") {
        clearChipFromSlots(chipBtn.dataset.chipId);
        return;
      }

      if (selectedChipId) {
        placeChip(selectedChipId, index);
      } else if (state.slots[index]) {
        clearChipFromSlots(state.slots[index]);
      }
    });
  }

  function init() {
    els.panel = document.getElementById("scramble-panel");
    els.slots = document.getElementById("scramble-slots");
    els.bank = document.getElementById("scramble-bank");
    els.submit = document.getElementById("scramble-submit");
    if (!els.panel) return;
    bindEvents();
  }

  return {
    init,
    setup(question, submitCb) {
      locked = false;
      selectedChipId = null;
      onSubmit = submitCb;
      const bankWords = Array.isArray(question.bankWords) && question.bankWords.length
        ? question.bankWords
        : question.words;
      const chips = bankWords.map((word, i) => ({ id: `w${i}`, word }));
      state = {
        chips,
        bankOrder: shuffleArray(chips.map((chip) => chip.id)),
        slots: question.words.map(() => null),
      };
      if (els.panel) els.panel.classList.remove("scramble-panel--incomplete");
      render();
    },
    reset() {
      state = null;
      selectedChipId = null;
      onSubmit = null;
      locked = false;
      if (els.slots) els.slots.innerHTML = "";
      if (els.bank) els.bank.innerHTML = "";
    },
    lock() {
      locked = true;
      selectedChipId = null;
      render();
    },
    getAnswer,
    allSlotsFilled,
  };
})();

document.addEventListener("DOMContentLoaded", () => ScrambleUI.init());
