import React, { useState } from 'react';
import { TabType } from './types';
import { AppLayout } from './components/AppLayout';
import { TodayView } from './components/TodayView';
import { DreamsView } from './components/DreamsView';
import { WisdomView } from './components/WisdomView';
import { PrayersView } from './components/PrayersView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'today' && <TodayView />}
      {activeTab === 'ala' && <DreamsView />}
      {activeTab === 'wisdom' && <WisdomView />}
      {activeTab === 'prayers' && <PrayersView />}
    </AppLayout>
  );
}
