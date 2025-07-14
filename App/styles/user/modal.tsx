import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#bdbdbd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: '#e11d48',
    borderColor: '#e11d48',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#222',
  },
  findPw: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#e11d48',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#e11d48',
    fontWeight: 'bold',
    fontSize: 14,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  agreeText: {
    fontSize: 14,
    color: '#222',
  },
  signupBtn: {
    backgroundColor: '#e11d48',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  signupBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#e11d48',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default modalStyles;
