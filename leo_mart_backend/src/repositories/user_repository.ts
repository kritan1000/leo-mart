import User, { IUser } from "../models/user_model";

export interface IUserRepository {
  findByUsername(username: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findAllPaginated(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IUser[]; total: number }>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}
export class UserMongoRepository implements IUserRepository {
  async findByUsername(username: string): Promise<IUser | null> {
    const foundUser = await User.findOne({ username: username });
    return foundUser;
  }
  async findByEmail(email: string): Promise<IUser | null> {
    const foundUser = await User.findOne({ email: email });
    return foundUser;
  }
  async create(user: IUser): Promise<IUser> {
    const createdUser = await User.create(user);
    return createdUser;
  }
  async findById(id: string): Promise<IUser | null> {
    const foundUser = await User.findById(id);
    return foundUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  async findAllPaginated(
    page: number,
    size: number,
    search?: string
  ): Promise<{ data: IUser[]; total: number }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * size;
    const total = await User.countDocuments(query);
    const data = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    return { data, total };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
  }
  async delete(id: string): Promise<boolean> {
    const deletedUser = await User.findByIdAndDelete(id);
    return !!deletedUser;
  }

  async findBusinessAccounts(
    page: number,
    size: number,
    status?: string
  ): Promise<{ data: IUser[]; total: number }> {
    const query: any = { "businessAccount.status": { $ne: "none" } };
    if (status) {
      query["businessAccount.status"] = status;
    }

    const skip = (page - 1) * size;
    const total = await User.countDocuments(query);
    const data = await User.find(query)
      .sort({ "businessAccount.appliedAt": -1 })
      .skip(skip)
      .limit(size);

    return { data, total };
  }
}
