import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CraneRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showModal, setShowModal] = useState(false);

  const ActionButton = ({ onPress, style, children }) => (
    <TouchableOpacity
      style={[styles.actionButton, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );

  const FloatingActionButton = ({ icon, onPress, style }) => (
    <TouchableOpacity
      style={[styles.floatingButton, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={40} color="#ffffff" />
    </TouchableOpacity>
  );

  const ModalContent = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption}>
            <Ionicons name="document-outline" size={24} color="#ffffff" />
            <Text style={styles.modalOptionText}>ثبت پروژه</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.modalSecondOption]}
          >
            <Ionicons name="settings-outline" size={24} color="#ffffff" />
            <Text style={styles.modalOptionText}>ثبت جزئیات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Tabs */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "requests" && styles.activeTab]}
            onPress={() => setActiveTab("requests")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "requests" && styles.activeTabText,
              ]}
            >
              درخواست‌ها
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "myRequests" && styles.activeTab]}
            onPress={() => setActiveTab("myRequests")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "myRequests" && styles.activeTabText,
              ]}
            >
              درخواست‌های من
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {activeTab === "requests"
              ? "هیچ درخواستی وجود ندارد"
              : "شما هیچ درخواستی ثبت نکرده‌اید"}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.menuActionBar}>
        <View style={styles.bottomActionBar}>
          <View style={styles.leftActions}>
            <ActionButton style={styles.actionButton}>
              <Ionicons name="happy-outline" size={20} color="#353535" />
              <Text style={styles.secondaryButtonText}>پیشنهاد</Text>
            </ActionButton>
          </View>

          <View style={styles.borderOfAddBtn}>
            <FloatingActionButton
              icon="add"
              onPress={() => setShowModal(true)}
              style={styles.centerFloatingButton}
            />
          </View>

          <View style={styles.rightActions}>
            <ActionButton style={styles.actionButton}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#6B7280"
              />
              <Text style={styles.secondaryButtonText}>درخواست</Text>
            </ActionButton>
          </View>
        </View>
      </View>

      {/* Modal for Add Options */}
      <ModalContent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    fontFamily: "Vazir",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    fontFamily: "Vazir",
  },
  activeTabText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    fontFamily: "Vazir",
  },
  menuActionBar: {
    padding: 30,
  },
  bottomActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFC107",
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
    // borderTopWidth: 1,
    // borderTopColor: "#e0e0e0",
    borderColor: "#9D7600",
    borderRadius: 10,
  },
  leftActions: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightActions: {
    flex: 1,
    alignItems: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 50,
    borderRadius: 25,
    // backgroundColor: "#F3F4F6",

    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#353535",
    fontWeight: "600",
    fontFamily: "Vazir",
  },
  floatingButton: {
    width: 76,
    height: 76,
    borderRadius: 50,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  borderOfAddBtn: {
    backgroundColor: "#f8f8f8",
    bottom: 40,
    left: "50%",
    marginLeft: -28,
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
  },
  centerFloatingButton: {
    margin: "auto",
    // position: "absolute",
    // bottom: 50,
    // left: "50%",
    // marginLeft: -28,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: "#fff",
    zIndex: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    height: 100,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "transparent",
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    paddingTop: 80,
  },
  modalCloseButton: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    backgroundColor: "#1F2937",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalOption: {
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalSecondOption: {
    backgroundColor: "#F59E0B",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CraneRequestsScreen;
