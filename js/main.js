const { createApp, ref } = Vue;

createApp({
  setup() {
    const showModal = ref(false)

    const turn = ref(0);
    const monster = monsterData;
    const moveList = moveListData
    const selectedID = ref(0)
    const selectedSide = ref(1)
    const isBattle = ref(false)

    const lvlMon1 = ref(1)
    const monster1 = ref({})
    const monster1HP = ref(0)
    const monster1Move = ref(0)
    const monster1Width = ref("100%")

    const lvlMon2 = ref(1)
    const monster2 = ref({})
    const monster2HP = ref(0)
    const monster2Move = ref(0)
    const monster2Width = ref("100%")

    const computedMonster = ref({})

    const changeMonster = (method) => {

      if (method == 1) {
        selectedID.value += 1
      } else {
        selectedID.value -= 1
      }

      if (selectedID.value < 0) {
        selectedID.value = monster.length - 1
      }

      if (selectedID.value >= monster.length) {
        selectedID.value = 0
      }

      if (selectedSide.value == 1) {
        lvlMon1.value = 1
      } else {
        lvlMon2.value = 1
      }

      leveling(0, 0)
    }

    const selectMonster = (side) => {
      showModal.value = true
      isBattle.value = false

      if (side == 1) {
        monster1.value = computedMonster.value
        monster1HP.value = computedMonster.value.hp
        monster1Move.value = computedMonster.value.moves[0]
      } else {
        monster2.value = computedMonster.value
        monster2HP.value = computedMonster.value.hp
        monster2Move.value = computedMonster.value.moves[0]
      }
    }

    const attack = () => {
      if (turn.value == 0) {
        monster2HP.value -= damageCalculator(moveList[monster1Move.value].type, moveList[monster1Move.value].pDam + moveList[monster1Move.value].mDam, monster1.value.atk, monster2.value.def, monster1.value.magic, monster2.value.magicRst)

        if (monster2HP.value <= 0) {
          monster2HP.value = 0
          isBattle.value = false
        }
        
        monster2Width.value = Math.round((monster2HP.value / monster2.value.hp) * 100) + "%"
        turn.value = 1
      } else if (turn.value == 1) {
        monster1HP.value -= damageCalculator(moveList[monster2Move.value].type, moveList[monster2Move.value].pDam + moveList[monster2Move.value].mDam, monster2.value.atk, monster1.value.def, monster2.value.magic, monster1.value.magicRst)

        if (monster1HP.value <= 0) {
          monster1HP.value = 0
          isBattle.value = false
        }
        
        monster1Width.value = Math.round((monster1HP.value / monster1.value.hp) * 100) + "%"
        turn.value = 0
      }
    }

    const damageCalculator = (type, spDmg, atk, def, magic, magicRst) => {
      if (type == "p") {
        return Math.round((((((2 * 5) / 5) + 2) * spDmg * (atk / def)) / 10) + 2)
      } else if (type == 'm') {
        return Math.round((((((2 * 5) / 5) + 2) * spDmg * (magic / magicRst)) / 10) + 2)
      }
    }

    const battle = () => {
      if (monster1.value.spd > monster2.value.spd) {
        turn.value = 0
      } else {
        turn.value = 1
      }

      monster1HP.value = monster1.value.hp
      monster2HP.value = monster2.value.hp
      monster1Width.value = "100%"
      monster2Width.value = "100%"

      isBattle.value = true
    }

    const leveling = (method, side) => {
      let lvlDiffer = 0;
      if (side == 1) {
        method == 0 ? lvlMon1.value += 1 : lvlMon1.value -= 1
        lvlDiffer = lvlMon1.value - 1
      } else if (side == 2) {
        method == 0 ? lvlMon2.value += 1 : lvlMon2.value -= 1
        lvlDiffer = lvlMon2.value - 1
      }
      
      const rank = []
      
      rank.push({ value: monster[selectedID.value].hp, name: "hp" }, { value: monster[selectedID.value].atk, name: "atk" }, { value: monster[selectedID.value].def, name: "def" }, { value: monster[selectedID.value].magic, name: "magic" }, { value: monster[selectedID.value].magicRst, name: "magicRst" })
      
      rank.sort(function(a, b){
        return b.value - a.value;
      });
      
      rank[0].value += (lvlDiffer * 3) - Math.floor(lvlDiffer / 3)
      rank[1].value += lvlDiffer - Math.floor(lvlDiffer / 3)
      rank[2].value += lvlDiffer - Math.floor(lvlDiffer / 3)
      rank[3].value += Math.floor(lvlDiffer / 3) * 2
      rank[4].value += Math.floor(lvlDiffer / 3)
      
      console.log(rank);

      computedMonster.value = {
        monster: monster[selectedID.value].monster,
        hp: 0,
        atk: 0,
        def: 0,
        magic: 0,
        magicRst: 0,
        spd: monster[selectedID.value].spd + Math.floor((lvlDiffer - 1)/3) * 5,
        moves: monster[selectedID.value].moves,
        card: monster[selectedID.value].card
      }
  
      if (selectedSide.value == 1) {
        computedMonster.value.lvl = lvlMon1.value
      } else if (selectedSide.value == 2) {
        computedMonster.value.lvl = lvlMon2.value
      }

      rank.forEach(e => {
        if (e.name === 'hp') {
          computedMonster.value.hp = e.value
        } else if (e.name === 'atk') {
          computedMonster.value.atk = e.value
        } else if (e.name === 'def') {
          computedMonster.value.def = e.value
        } else if (e.name === 'magic') {
          computedMonster.value.magic = e.value
        } else if (e.name === 'magicRst') {
          computedMonster.value.magicRst = e.value
        }
      });

      console.log(computedMonster.value);
    }

    return {
      isBattle,
      showModal,
      monster,
      moveList,
      monster1,
      monster2,
      selectedID,
      selectedSide,
      lvlMon1,
      lvlMon2,
      monster1HP,
      monster2HP,
      monster1Move,
      monster2Move,
      turn,
      monster1Width,
      monster2Width,
      computedMonster,
      selectMonster,
      changeMonster,
      attack,
      battle,
      leveling
    };
  },
}).mount("#app");
