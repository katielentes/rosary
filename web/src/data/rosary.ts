/**
 * Prayer texts aligned to the instructor slide deck
 * (rosaries.com-based layout in rosary_Instructor_PDF_Slides.pdf at repo root).
 * Extracted and normalized from PDF text; adjust if your parish uses different wording.
 */

export type MysterySetId = 'joyful' | 'sorrowful' | 'glorious' | 'luminous'

export type StepKind =
  | 'opening'
  | 'mystery_intro'
  | 'decade_start'
  | 'hail_mary_repeat'
  | 'decade_end'
  | 'closing'

export interface RosaryStep {
  id: string
  kind: StepKind
  label: string
  /** Full prayer or instruction to read aloud */
  text: string
  /** UI-only encouragement; not part of the liturgical text */
  encouragement?: string
  decadeIndex?: number
}

/** Index of first decade step (Sign of the Cross through opening Glory come before this). */
export function openingStepCount(steps: RosaryStep[]): number {
  const i = steps.findIndex((s) => s.kind === 'mystery_intro')
  return i === -1 ? 0 : i
}

export interface MysterySetMeta {
  id: MysterySetId
  title: string
  shortLabel: string
  mysteries: { title: string; fruit?: string; announceOrdinal: string }[]
}

const ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth'] as const

export const MYSTERY_SETS: Record<MysterySetId, MysterySetMeta> = {
  joyful: {
    id: 'joyful',
    title: 'The Joyful Mysteries',
    shortLabel: 'Joyful',
    mysteries: [
      { title: 'The Annunciation', fruit: 'Humility', announceOrdinal: ORD[0] },
      { title: 'The Visitation', fruit: 'Love of neighbor', announceOrdinal: ORD[1] },
      { title: 'The Nativity', fruit: 'Detachment from riches', announceOrdinal: ORD[2] },
      { title: 'The Presentation', fruit: 'Obedience', announceOrdinal: ORD[3] },
      {
        title: 'Finding In The Temple',
        fruit: 'Piety',
        announceOrdinal: ORD[4],
      },
    ],
  },
  sorrowful: {
    id: 'sorrowful',
    title: 'The Sorrowful Mysteries',
    shortLabel: 'Sorrowful',
    mysteries: [
      { title: 'Agony In The Garden', fruit: 'Contrition', announceOrdinal: ORD[0] },
      { title: 'Scourging At The Pillar', fruit: 'Purity', announceOrdinal: ORD[1] },
      { title: 'Crowning With Thorns', fruit: 'Moral courage', announceOrdinal: ORD[2] },
      { title: 'Carrying Of The Cross', fruit: 'Patience', announceOrdinal: ORD[3] },
      { title: 'The Crucifixion', fruit: 'Perseverance', announceOrdinal: ORD[4] },
    ],
  },
  glorious: {
    id: 'glorious',
    title: 'The Glorious Mysteries',
    shortLabel: 'Glorious',
    mysteries: [
      { title: 'The Resurrection', fruit: 'Faith', announceOrdinal: ORD[0] },
      { title: 'The Ascension', fruit: 'Hope', announceOrdinal: ORD[1] },
      { title: 'The Descent of the Holy Spirit', fruit: 'Love', announceOrdinal: ORD[2] },
      { title: 'The Assumption', fruit: 'Devotion to Mary', announceOrdinal: ORD[3] },
      { title: 'The Coronation', fruit: 'Eternal happiness', announceOrdinal: ORD[4] },
    ],
  },
  luminous: {
    id: 'luminous',
    title: 'The Luminous Mysteries',
    shortLabel: 'Luminous',
    mysteries: [
      { title: 'The Baptism of Christ', fruit: 'Openness to the Spirit', announceOrdinal: ORD[0] },
      { title: 'The Wedding at Cana', fruit: 'Mary’s intercession', announceOrdinal: ORD[1] },
      { title: 'The Proclamation of the Kingdom', fruit: 'Repentance', announceOrdinal: ORD[2] },
      { title: 'The Transfiguration', fruit: 'Desire for holiness', announceOrdinal: ORD[3] },
      { title: 'The Institution of the Eucharist', fruit: 'Eucharistic adoration', announceOrdinal: ORD[4] },
    ],
  },
}

/** Wording from instructor PDF (rosaries.com slides) */
const PRAYERS = {
  signOfCross: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen.`,

  prayerBeforeRosary: `QUEEN OF THE Holy Rosary, you have deigned to come to Fatima to reveal to the three shepherd children the treasures of grace hidden in the Rosary. Inspire my heart with a sincere love of this devotion, in order that by meditating on the Mysteries of our Redemption which are recalled in it, I may be enriched with its fruits and obtain peace for the world, the conversion of sinners and of Russia, and the favor which I ask of you in this Rosary. (Here mention your request.) I ask it for the greater glory of God, for your own honor, and for the good of souls, especially for my own. Amen.`,

  creed: `I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead.

I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`,

  ourFatherOpening: `Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come,
thy will be done on earth as it is in heaven.
Give us this day our daily bread,
and forgive us our trespasses,
as we forgive those who trespass against us;
and lead us not into temptation, but deliver us from evil. Amen.`,

  /** Decades: text as on mystery slides */
  ourFatherDecade: `OUR FATHER, Who art in heaven, hallowed be Thy name: Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen`,

  /** Opening 3 and 10-bead decades — PDF uses “you / your” and this line break style */
  hailMary: `HAIL MARY, full of grace, the Lord is with you; blessed are you among women, and blessed is the fruit of your womb, Jesus. Holy Mary, Mother of God, pray for us sinners now and at the hour of our death. Amen.`,

  gloryBe: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`,

  fatima: `O MY JESUS, forgive us our sins, save us from the fire of hell, take all souls to heaven, and help especially those in most need of Your mercy.`,

  hailHolyQueen: `HAIL, HOLY QUEEN, Mother of Mercy, our life, our sweetness, and our hope. To you do we cry, poor banished children of Eve. To you do we send up our sighs, mourning and weeping in this valley of tears. Turn then, O most gracious Advocate, your eyes of mercy toward us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus.

O clement, O loving, O sweet Virgin Mary!

Pray for us, O Holy Mother of God.

That we may be made worthy of the promises of Christ.`,

  prayerAfterRosary: `O GOD, WHOSE only-begotten Son, by His life, death and resurrection, has purchased for us the rewards of eternal life; grant, we beseech Thee, that, meditating on these mysteries of the Most Holy rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord Amen.

May the divine assistance remain always with us. Amen.

And may the souls of the faithful departed, through the mercy of God, rest in peace. Amen.`,
}

function mysteryLabelShort(setId: MysterySetId): string {
  switch (setId) {
    case 'joyful':
      return 'Joyful'
    case 'sorrowful':
      return 'Sorrowful'
    case 'glorious':
      return 'Glorious'
    case 'luminous':
      return 'Luminous'
    default:
      return ''
  }
}

export function buildSteps(setId: MysterySetId): RosaryStep[] {
  const meta = MYSTERY_SETS[setId]
  const steps: RosaryStep[] = []
  const push = (s: RosaryStep) => steps.push(s)
  const setWord = mysteryLabelShort(setId)

  push({
    id: 'opening-sign',
    kind: 'opening',
    label: 'Sign of the Cross',
    text: `Hold your Rosary by the Crucifix and make the sign of the cross.\n\n${PRAYERS.signOfCross}`,
    encouragement: 'Begin here. Slow breath, unclench your shoulders.',
  })

  push({
    id: 'opening-prayer-before',
    kind: 'opening',
    label: 'Prayer Before the Rosary',
    text: PRAYERS.prayerBeforeRosary,
    encouragement: 'Optional personal intention, name it quietly if you like.',
  })

  push({
    id: 'opening-creed',
    kind: 'opening',
    label: 'Apostles’ Creed',
    text: PRAYERS.creed,
    encouragement: 'Say it like you mean it. Belief is a gift you can ask for.',
  })

  push({
    id: 'opening-of',
    kind: 'opening',
    label: 'Our Father',
    text: PRAYERS.ourFatherOpening,
    encouragement: 'The prayer Jesus taught us.',
  })

  for (let i = 0; i < 3; i++) {
    push({
      id: `opening-hail-${i}`,
      kind: 'opening',
      label: `Pray 3 Hail Mary’s (${i + 1} of 3)`,
      text: PRAYERS.hailMary,
      encouragement:
        i === 0
          ? 'For an increase of faith.'
          : i === 1
            ? 'For an increase of hope.'
            : 'For an increase of charity.',
    })
  }

  push({
    id: 'opening-glory',
    kind: 'opening',
    label: 'Glory Be To The Father',
    text: PRAYERS.gloryBe,
    encouragement: 'The opening prayers are almost done. Stay with it.',
  })

  for (let d = 0; d < 5; d++) {
    const m = meta.mysteries[d]
    push({
      id: `decade-${d}-mystery`,
      kind: 'mystery_intro',
      label: `Announce the mystery (${d + 1} of 5)`,
      text: `The ${m.announceOrdinal} ${setWord} Mystery\n${m.title}${m.fruit ? `\n\nFruit of the mystery: ${m.fruit}.` : ''}`,
      decadeIndex: d,
      encouragement: 'Picture the scene. Stay with one detail that stands out.',
    })

    push({
      id: `decade-${d}-our-father`,
      kind: 'decade_start',
      label: 'Our Father',
      text: PRAYERS.ourFatherDecade,
      decadeIndex: d,
      encouragement: 'This decade: one Our Father, ten Hail Marys, Glory Be, Fatima prayer.',
    })

    push({
      id: `decade-${d}-hail-marys`,
      kind: 'hail_mary_repeat',
      label: 'Pray 10 Hail Mary’s',
      text: PRAYERS.hailMary,
      decadeIndex: d,
      encouragement: 'Tap “Next bead” or press Space for each of the ten.',
    })

    push({
      id: `decade-${d}-glory`,
      kind: 'decade_end',
      label: 'Glory Be To The Father',
      text: PRAYERS.gloryBe,
      decadeIndex: d,
    })

    push({
      id: `decade-${d}-fatima`,
      kind: 'decade_end',
      label: 'Fatima Prayer',
      text: PRAYERS.fatima,
      decadeIndex: d,
      encouragement: d === 4 ? 'Last decade’s closing. Then we’ll crown Mary.' : undefined,
    })
  }

  push({
    id: 'closing-hhq',
    kind: 'closing',
    label: 'Hail Holy Queen Prayer',
    text: PRAYERS.hailHolyQueen,
    encouragement: 'Prayers get answered - not always on your timeline, but they get heard.',
  })

  push({
    id: 'closing-after',
    kind: 'closing',
    label: 'Prayer After The Rosary',
    text: PRAYERS.prayerAfterRosary,
  })

  push({
    id: 'closing-sign',
    kind: 'closing',
    label: 'Sign of the Cross',
    text: `Hold your Rosary by the Crucifix and make the sign of the cross.\n\n${PRAYERS.signOfCross}`,
    encouragement: 'Rest a moment. Thanks for praying with this little page.',
  })

  return steps
}

/** Bump if step list changes so stale indices are not restored */
export const STORAGE_KEY = 'rosary.session.v2'

export interface PersistedSession {
  mysterySet: MysterySetId
  stepIndex: number
  hailMaryIndex: number
}
