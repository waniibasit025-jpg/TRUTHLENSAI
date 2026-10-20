export interface PresetSample {
  id: string;
  name: string;
  category: string;
  title: string;
  sourceUrl?: string;
  text: string;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample-1',
    name: 'Viral Health Miracle',
    category: 'Misinformation / Scam',
    title: 'Secret Himalayan Compound Melts 30kg in 48 Hours',
    sourceUrl: 'https://wellness-truth-alert.example/secret-formula',
    text: 'URGENT MEDICAL BREAKTHROUGH: Big Pharma has been suppressing this ancient herbal tincture discovered high in the Himalayas! Rogue cardiologists have secretly confirmed that just two drops dissolved in warm lemon water triggers rapid metabolic liquefaction, melting 30kg of stubborn visceral belly fat in only 48 hours without any exercise or dieting. Mainstream doctors are panicking and trying to scrub this video from the internet. Do not trust medical regulators! Order your supply before our private servers are raided by the authorities tonight!',
  },
  {
    id: 'sample-2',
    name: 'Verified Clean Tech Wire',
    category: 'Accredited Journalism',
    title: 'Global Solar PV Deployments Exceed 600GW in Annual Grid Additions',
    sourceUrl: 'https://reuters.com/business/energy/solar-capacity-2025-report',
    text: 'Global utility-scale and rooftop solar photovoltaic capacity surged to an estimated 615 gigawatts during the 2025 calendar year, according to a joint audit released Monday by the International Renewable Energy Agency and European grid operators. The milestone represents an 18% year-on-year increase, predominantly fueled by accelerated manufacturing capacity across China and decentralized commercial microgrids in Southern Europe. However, analysts cautioned that high-voltage transmission interconnect delays and localized grid curtailment remain acute constraints across multiple regions.',
  },
  {
    id: 'sample-3',
    name: 'Sensational Social Media Post',
    category: 'Hyper-Partisan / Clickbait',
    title: 'Explosive Leak: Secret Nighttime Flight Transports Banned Cargo',
    sourceUrl: 'https://social-truth-x.example/post/98234190',
    text: 'LOOK AT THIS SATELLITE IMAGE RIGHT NOW! Insiders just leaked proof that a mysterious unmarked transport plane landed at 3:17 AM in an abandoned airfield. They were carrying crates labeled with biohazard warnings. The government is completely silent and the fake news media refuses to report on this terrifying invasion. If you don’t share this right now with 10 people, our entire country will be ruined by tomorrow morning!',
  },
  {
    id: 'sample-4',
    name: 'Peer-Reviewed Science Wire',
    category: 'Scientific Research',
    title: 'Atmospheric Ocean Sensors Record 0.12°C Marine Temperature Anomaly',
    sourceUrl: 'https://nature.example/articles/s41586-marine-monitoring',
    text: 'An international consortium of marine research vessels operating automated autonomous buoys has recorded a 0.12°C sea surface temperature anomaly across equatorial currents over the preceding six months. The peer-reviewed dataset, published in the Journal of Geophysical Research, indicates that localized wind oscillation patterns contributed to temporary thermocline displacement. Independent modeling teams from Scripps Institution of Oceanography replicated the thermal measurements within a 95% statistical confidence interval.',
  },
];
