import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../services/ThemeContext';
import { getHistory, getFavorites, getReadingLists } from '../services/researchStorage';
import ResearchVisualAnalytics from '../components/ResearchVisualAnalytics';

export default function ResearchDashboardScreen() {
  const { themeColors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [stats, setStats] = useState({ history: 0, favorites: 0, lists: 0 });
  const [trendData, setTrendData] = useState<{ year: string; count: number }[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const history = await getHistory();
      const favorites = await getFavorites();
      const lists = await getReadingLists();
      
      setStats({
        history: history.length,
        favorites: favorites.length,
        lists: lists.length
      });

      // Calculate trend data based on history publication years
      const yearsMap: Record<string, number> = {};
      history.forEach(p => {
        if (p.year) {
          yearsMap[p.year] = (yearsMap[p.year] || 0) + 1;
        }
      });
      
      const trends = Object.keys(yearsMap).map(y => ({ year: y, count: yearsMap[y] }));
      trends.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      setTrendData(trends.slice(-5)); // Last 5 years
    };
    
    loadStats();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Research Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <StatCard title="Viewed" count={stats.history} icon="time" color="#2196F3" />
          <StatCard title="Saved" count={stats.favorites} icon="heart" color="#E91E63" />
          <StatCard title="Collections" count={stats.lists} icon="folder" color="#FF9800" />
        </View>

        <ResearchVisualAnalytics data={trendData.length > 0 ? trendData : [{ year: '2024', count: 1 }]} />

        <TouchableOpacity 
          style={[styles.listCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        >
          <View style={styles.listCardLeft}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={[styles.listCardTitle, { color: themeColors.text }]}>Favorite Papers</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.subText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.listCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        >
          <View style={styles.listCardLeft}>
            <Ionicons name="time" size={24} color="#2196F3" />
            <Text style={[styles.listCardTitle, { color: themeColors.text }]}>Recent History</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.subText} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ title, count, icon, color }: { title: string, count: number, icon: any, color: string }) {
  const { themeColors } = useAppTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <Ionicons name={icon} size={28} color={color} style={{ marginBottom: 8 }} />
      <Text style={[styles.statCount, { color: themeColors.text }]}>{count}</Text>
      <Text style={[styles.statTitle, { color: themeColors.subText }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  }
});
