import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Checking from "../../assets/tickets/Checking.svg";

interface TicketCancelProps {
  visible: boolean;
  onClose: () => void;
  onCancel?: () => void; // 선택적으로 변경
  onConfirm?: () => void; // 확인 버튼 클릭 시 호출될 함수
  message?: string;
}

export default function TicketCancel({
  visible,
  onClose,
  onCancel,
  onConfirm,
  message,
}: TicketCancelProps) {
  const [isCancelled, setIsCancelled] = useState(false);

  const handleCancel = () => {
    setIsCancelled(true);
    if (onCancel) {
      onCancel();
    }
  };

  const handleClose = () => {
    setIsCancelled(false);
    onClose();
  };

  const handleConfirm = () => {
    setIsCancelled(false);
    onClose();
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.view}>
          <View style={styles.div224}>
            <View style={styles.iconContainer}>
              <Checking style={styles.marginWrapIcon} width={64} height={80} />
            </View>
            <View style={styles.marginWrap}>
              <View style={styles.h3228}>
                <Text style={styles.text}>{isCancelled ? "완료" : "안내"}</Text>
              </View>
            </View>
            <View style={styles.marginWrap1}>
              <View style={[styles.p231, styles.p231FlexBox]}>
                <Text style={[styles.text1, styles.textTypo]}>
                  {isCancelled
                    ? "취소되었습니다"
                    : message || "정말로 취소 하시겠습니까?"}
                </Text>
              </View>
            </View>
            {!isCancelled ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.cancelBtn, styles.p231FlexBox]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.cancelBtnText, styles.textTypo]}>
                    취소하기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.closeBtn, styles.p231FlexBox]}
                  onPress={handleClose}
                >
                  <Text style={[styles.closeBtnText, styles.textTypo]}>
                    닫기
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                  style={[styles.confirmBtn, styles.p231FlexBox]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.confirmBtnText, styles.textTypo]}>
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  p231FlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  textTypo: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 14,
  },
  marginWrapIcon: {},
  text: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "left",
  },
  h3228: {
    width: 272, // 고정값으로 복구
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // 가운데 정렬 추가
  },
  marginWrap: {
    paddingBottom: 8,
    flexDirection: "row",
  },
  text1: {
    lineHeight: 20,
    color: "#4b5563",
    textAlign: "center",
  },
  p231: {
    width: 272, // 고정값으로 복구
    height: 20,
  },
  marginWrap1: {
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "center", // 가운데 정렬 추가
    alignItems: "center", // 수직 가운데 정렬 추가
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 272,
    gap: 12,
  },
  cancelBtn: {
    borderRadius: 8,
    backgroundColor: "#e53e3e",
    height: 37,
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#fff",
    lineHeight: 21,
  },
  closeBtn: {
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    height: 37,
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#4b5563",
    lineHeight: 21,
  },
  confirmButtonContainer: {
    width: 272,
    alignItems: "center",
  },
  confirmBtn: {
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    height: 37,
    width: 120,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    color: "#4b5563",
    lineHeight: 21,
  },
  div224: {
    height: 189,
    alignItems: "center",
    width: 272, // 고정값으로 복구
  },
  view: {
    backgroundColor: "#fff",
    width: 320, // 고정값
    alignSelf: "center", // 화면 중앙에 오도록 추가
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 1,
    borderRadius: 16,
    height: 237,
    overflow: "hidden",
    padding: 24,
    maxWidth: 320,
  },
  iconContainer: {
    position: "relative",
    width: 70,
    height: 70,
    backgroundColor: "#dcfce7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});
